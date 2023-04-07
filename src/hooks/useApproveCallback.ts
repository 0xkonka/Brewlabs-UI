import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import { Trade, CurrencyAmount } from "@brewlabs/sdk";
import { useCallback, useMemo } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { ROUTER_ADDRESS } from "config/constants";
import useTokenAllowance from "./useTokenAllowance";
import { Field } from "state/swap/actions";
import { useTransactionAdder, useHasPendingApproval } from "state/transactions/hooks";
import { computeSlippageAdjustedAmounts } from "utils/prices";
import { calculateGasMargin } from "utils";
import { useTokenContract } from "./useContract";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<TransactionResponse>] {
  const { chainId, library ,account } = useActiveWeb3React();
  // const account = "0xaE837FD1c51705F3f8f232910dfeCB9180541B27";
  const token = amountToApprove && !amountToApprove?.currency.isNative ? amountToApprove.currency : undefined;
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender);
  const pendingApproval = useHasPendingApproval(token?.address, spender);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<TransactionResponse> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }
    if (!token) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }

    let useExact = false;

    const gasPrice = await getNetworkGasPrice(library, chainId);
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true;
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString());
    });
    console.log(estimatedGas);
    // eslint-disable-next-line consistent-return
    const response: TransactionResponse = await tokenContract.approve(
      spender,
      useExact ? amountToApprove.raw.toString() : MaxUint256,
      {
        gasPrice,
        gasLimit: calculateGasMargin(estimatedGas),
      }
    );
    // add transaction detail to the global state store
    addTransaction(response, {
      summary: `Approve ${amountToApprove.currency.symbol}`,
      approval: { tokenAddress: token.address, spender },
    });

    return response;
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction, chainId, library]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const { chainId } = useActiveWeb3React();
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  );

  return useApproveCallback(amountToApprove, ROUTER_ADDRESS[chainId]);
}

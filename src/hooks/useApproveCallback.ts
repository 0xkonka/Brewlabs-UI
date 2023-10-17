import { Trade, CurrencyAmount, ROUTER_ADDRESS_MAP, EXCHANGE_MAP } from "@brewlabs/sdk";
import { useCallback, useMemo } from "react";
import { parseEther } from "viem";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { calculateGasMargin } from "utils";
import { getAggregatorAddress } from "utils/addressHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { computeSlippageAdjustedAmounts } from "utils/prices";
import { Field } from "state/swap/actions";
import { useTransactionAdder, useHasPendingApproval } from "state/transactions/hooks";

import { useTokenContract } from "./useContract";
import useTokenAllowance from "./useTokenAllowance";

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(amountToApprove?: CurrencyAmount, spender?: string): [ApprovalState, () => Promise<`0x${string}`>] {
  const { chainId, account } = useActiveWeb3React();

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

  const approve = useCallback(async () => {
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

    try {
      const gasPrice = await getNetworkGasPrice(chainId);
      const estimatedGas = await tokenContract.estimateGas
        .approve([spender, parseEther("1000000000000000")], {
          account: tokenContract.account,
          chain: tokenContract.chain,
        })
        .catch(() => {
          // general fallback for tokens who restrict approval amounts
          useExact = true;
          return tokenContract.estimateGas.approve([spender, amountToApprove.raw.toString()], {
            account: tokenContract.account,
            chain: tokenContract.chain,
          });
        });

      // eslint-disable-next-line consistent-return
      const response = await tokenContract.write.approve(
        [spender, useExact ? amountToApprove.raw.toString() : parseEther("1000000000000000")],
        {
          gasPrice,
          gasLimit: calculateGasMargin(estimatedGas),
        }
      );
      // add transaction detail to the global state store
      addTransaction(
        { hash: response },
        {
          summary: `Approve ${amountToApprove.currency.symbol}`,
          approval: { tokenAddress: token.address, spender },
        }
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction, chainId]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  amountIn: CurrencyAmount,
  trade?: Trade,
  allowedSlippage = 0,
  noLiquidity = false
) {
  const { chainId } = useActiveWeb3React();
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  );

  return useApproveCallback(
    noLiquidity ? amountIn : amountToApprove,
    noLiquidity ? getAggregatorAddress(chainId) : ROUTER_ADDRESS_MAP[EXCHANGE_MAP[chainId][0]?.key][chainId]
  );
}

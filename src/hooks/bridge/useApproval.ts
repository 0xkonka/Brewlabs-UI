import { useCallback, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

import { BridgeToken } from "config/constants/types";
import { useActiveChainId } from "hooks/useActiveChainId";
import { approveToken, fetchAllowance } from "lib/bridge/token";
import { getViemClients } from "utils/viem";

export const useApproval = (fromToken: BridgeToken, fromAmount: bigint, txHash?: string) => {
  const { chainId: providerChainId } = useActiveChainId();
  const { address: account } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [allowance, setAllowance] = useState(BigInt(0));
  const [allowed, setAllowed] = useState(true);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState<string | undefined>();

  useEffect(() => {
    if (fromToken && account && providerChainId === fromToken.chainId) {
      const publicClient = getViemClients({ chainId: fromToken.chainId });
      if (account) fetchAllowance(fromToken, account, publicClient).then(setAllowance);
    } else {
      setAllowance(BigInt(0));
    }
  }, [account, fromToken, providerChainId, txHash]);

  useEffect(() => {
    if (!fromToken || !fromAmount) {
      setAllowed(false);
      return;
    }
    setAllowed(allowance >= fromAmount);
  }, [fromAmount, allowance, fromToken]);

  const approve = useCallback(async () => {
    setUnlockLoading(true);
    const publicClient = getViemClients({ chainId: fromToken.chainId });
    const approvalAmount = fromAmount;

    try {
      if (!walletClient) return;
      const tx = await approveToken(walletClient, fromToken, approvalAmount);
      setApprovalTxHash(tx);

      await publicClient.waitForTransactionReceipt({ hash: tx, confirmations: 2 });
      setAllowance(approvalAmount);
    } catch (approveError: any) {
      if (approveError?.code === "TRANSACTION_REPLACED") {
        if (approveError.cancelled) {
          throw new Error("transaction was replaced");
        } else {
          console.debug("TRANSACTION_REPLACED");
          setApprovalTxHash(approveError.replacement.hash);
          try {
            await approveError.replacement.wait();
            setAllowance(approvalAmount);
          } catch (secondApprovalError) {
            console.error({
              secondApprovalError,
              fromToken,
              approvalAmount: approvalAmount.toString(),
              account,
            });
            throw secondApprovalError;
          }
        }
      } else {
        console.error({
          approveError,
          fromToken,
          approvalAmount: approvalAmount.toString(),
          account,
        });
        throw approveError;
      }
    } finally {
      setApprovalTxHash(undefined);
      setUnlockLoading(false);
    }
  }, [fromAmount, fromToken, walletClient, account]);

  return { allowed, unlockLoading, approvalTxHash, approve };
};

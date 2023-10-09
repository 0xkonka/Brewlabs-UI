import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usePublicClient } from "wagmi";

import { POLLING_INTERVAL } from "config/constants/bridge";
import { useBridgeContext } from "contexts/BridgeContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { timeout, withTimeout } from "lib/bridge/helpers";
import { getMessage, getMessageData, messageCallStatus, NOT_ENOUGH_COLLECTED_SIGNATURES } from "lib/bridge/message";
import { getViemClients } from "utils/viem";

import { useBridgeDirection } from "./useBridgeDirection";
import { useNeedsClaiming } from "./useNeedsClaiming";

export const useTransactionStatus = (setMessage: any) => {
  const { chainId } = useActiveChainId();
  const publicClient = usePublicClient();

  const needsClaiming = useNeedsClaiming();
  const { loading, setLoading, txHash, setTxHash }: any = useBridgeContext();
  const { homeChainId, getBridgeChainId, getAMBAddress, getTotalConfirms } = useBridgeDirection();

  const isHome = chainId === homeChainId;
  const totalConfirms = getTotalConfirms(chainId);
  const bridgeChainId = getBridgeChainId(chainId);

  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loadingText, setLoadingText] = useState<string>();
  const [confirmations, setConfirmations] = useState(0);

  const completeReceipt = useCallback(() => {
    setTxHash();
    setLoading(false);
    setLoadingText(undefined);
    setConfirmations(0);
    toast.success(`The token has been successfully transferred. After a while it will appear in the history table.`);
  }, [setLoading, setTxHash]);

  const incompleteReceipt = useCallback(() => {
    setLoading(false);
    setLoadingText(undefined);
    setConfirmations(0);
    toast.success("Claim was failed");
  }, [setLoading]);

  useEffect(() => {
    if (!loading) {
      setLoadingText(undefined);
      setConfirmations(0);
    }
  }, [loading]);

  const getStatus = useCallback(async () => {
    try {
      const bridgeClient = getViemClients({ chainId: 56 });

      const txReceipt = await bridgeClient.getTransactionReceipt({ hash: txHash });
      const numConfirmations = txReceipt
        ? +(await bridgeClient.getTransactionConfirmations({ hash: txHash })).toString()
        : 0;
      const enoughConfirmations = numConfirmations >= totalConfirms;

      if (txReceipt) {
        setConfirmations(numConfirmations);
        if (enoughConfirmations) {
          const bridgeAmbAddress = getAMBAddress(bridgeChainId);
          if (needsClaiming) {
            setLoadingText("Collecting Signatures");
            const message = await getMessage(isHome, publicClient, getAMBAddress(chainId), txHash);

            setLoadingText("Waiting for Execution");
            if (message && message.signatures) {
              const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
              await sleep(10 * POLLING_INTERVAL);
              const status = await messageCallStatus(bridgeAmbAddress, bridgeClient, message.messageId);
              if (status) {
                completeReceipt();
                return true;
              } else {
                setNeedsConfirmation(true);
                incompleteReceipt();
                setMessage(message);
                return true;
              }
            }
          } else {
            setLoadingText("Waiting for Execution");

            const { messageId } = await getMessageData(isHome, publicClient, txHash, txReceipt);
            const status = await messageCallStatus(bridgeAmbAddress, bridgeClient, messageId);
            if (status) {
              completeReceipt();
              return true;
            }
          }
        }
      }
    } catch (txError: any) {
      if (txError?.code === "TRANSACTION_REPLACED" && !txError.cancelled) {
        console.debug("TRANSACTION_REPLACED");
        setTxHash(txError.replacement.hash);
      } else if (
        txError?.message === "timed out" ||
        (needsClaiming && txError?.message === NOT_ENOUGH_COLLECTED_SIGNATURES)
      ) {
        return false;
      }
      completeReceipt();
      console.error({ txError });
      return true;
    }
    return false;
  }, [
    isHome,
    needsClaiming,
    txHash,
    setTxHash,
    totalConfirms,
    completeReceipt,
    incompleteReceipt,
    chainId,
    bridgeChainId,
    getAMBAddress,
    setMessage,
  ]);

  useEffect(() => {
    if (!loading || !txHash) {
      return () => undefined;
    }

    setLoadingText("Waiting for Confirmations");
    let isSubscribed = true;

    const updateStatus = async () => {
      const status = !isSubscribed || (await getStatus());
      if (!status && loading && txHash && publicClient) {
        await timeout(POLLING_INTERVAL);
        updateStatus();
      }
    };

    updateStatus();

    return () => {
      isSubscribed = false;
    };
  }, [loading, txHash, publicClient, getStatus]);

  useEffect(() => {
    setNeedsConfirmation((needs) => chainId === homeChainId && needs);
  }, [homeChainId, chainId]);

  return {
    loadingText,
    needsConfirmation,
    setNeedsConfirmation,
    confirmations,
  };
};

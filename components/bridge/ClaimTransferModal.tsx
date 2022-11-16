import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProvider } from "wagmi";

import Modal from "components/Modal";
import { useBridgeContext } from "contexts/BridgeContext";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { useClaim } from "hooks/bridge/useClaim";
import { isRevertedError, TOKENS_CLAIMED } from "lib/bridge/amb";
import { getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { messageCallStatus } from "lib/bridge/message";
import LoadingModal from "./LoadingModal";

type ClaimTransferModalProps = {
  message: any;
  setMessage: React.Dispatch<React.SetStateAction<any>>;
};
const ClaimTransferModal = ({ message, setMessage }: ClaimTransferModalProps) => {
  const ethersProvider = useProvider();
  const { homeChainId, foreignChainId, foreignAmbAddress } = useBridgeDirection();
  const { txHash, setTxHash } = useBridgeContext();

  const [isOpen, setOpen] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [executed, setExecuted] = useState(false);

  const onClose = useCallback(() => {
    setTxHash(undefined);
    setMessage(undefined);
    setOpen(false);
  }, [setTxHash, setMessage]);

  const showError = useCallback((errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  }, []);

  useEffect(() => {
    if (message && message.messageId) {
      const { messageId } = message;
      messageCallStatus(foreignAmbAddress, ethersProvider, messageId).then((status) => {
        if (status) {
          setExecuted(true);
        }
      });
    }
  }, [message, foreignAmbAddress, ethersProvider]);

  const { claim, executing, executionTx } = useClaim();

  const claimTokens = useCallback(async () => {
    try {
      setClaiming(true);
      await claim(txHash!, message);
    } catch (claimError: any) {
      console.error({ claimError });
      if (claimError.message === TOKENS_CLAIMED || isRevertedError(claimError)) {
        setExecuted(true);
      } else {
        handleWalletError(claimError, showError);
      }
    } finally {
      setClaiming(false);
    }
  }, [claim, txHash, showError, message]);

  useEffect(() => {
    if (!executing && !claiming && executionTx) {
      onClose();
    }
  }, [executing, claiming, executionTx, onClose]);

  if (claiming || executing)
    return <LoadingModal loadingText="Waiting for Execution" chainId={homeChainId} txHash={txHash} />;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-4 font-brand">
        <h5 className="mb-2 text-2xl dark:text-slate-400">Claim Your Tokens</h5>
        <p className="py-3 dark:text-gray-500">
          {`The claim process may take a variable period of time on ${getNetworkLabel(foreignChainId)}${" "}
                    depending on network congestion. Your token balance will increase to reflect${" "}
                    the completed transfer after the claim is processed`}
        </p>
        {executed && (
          <div
            className="border-danger-400 bg-danger-100 relative mt-2 rounded border px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="font-bold">
              The tokens were already claimed. Check your token balance in{" "}
              <strong>{getNetworkLabel(foreignChainId)}</strong>.
            </strong>
          </div>
        )}
        <div className="mt-3 text-center">
          <button
            className="ml-auto mr-3 rounded border border-gray-500 bg-transparent py-2 px-4 outline-none hover:border-transparent hover:bg-gray-500 hover:text-white dark:text-gray-500 dark:hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="rounded border border-blue-500 bg-transparent py-2 px-5 outline-none hover:border-transparent hover:bg-blue-500 hover:text-white dark:text-gray-500 dark:hover:text-white"
            onClick={claimTokens}
            disabled={claiming || executing || executed}
          >
            Claim
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimTransferModal;

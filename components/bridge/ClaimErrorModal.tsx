import React from "react";
import Modal from "components/Modal";
import { BridgeToken } from "config/constants/types";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { getNetworkLabel } from "lib/bridge/helpers";

type ClaimErrorModalProps = {
  open: boolean;
  token?: BridgeToken;
  onDismiss: () => void;
};

const ClaimErrorModal = ({ open, token, onDismiss }: ClaimErrorModalProps) => {
  const { foreignChainId } = useBridgeDirection();

  return (
    <Modal open={open} onClose={onDismiss}>
      <div className="p-4 font-brand">
        <h5 className="mb-2 text-2xl dark:text-slate-400">Transfer done already</h5>
        <p className="py-3 dark:text-gray-500">
          The tokens were already claimed. Check your
          {token ? ` ${token.symbol} ` : " "}
          token balance in <strong>{getNetworkLabel(foreignChainId)}</strong>.
        </p>
        <div className="mt-3 text-center">
          <button
            className="m-auto rounded border border-blue-500 bg-transparent py-2 px-4 hover:border-transparent hover:bg-blue-500 hover:text-white dark:text-gray-500 dark:hover:text-white"
            onClick={onDismiss}
          >
            Understand
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimErrorModal;

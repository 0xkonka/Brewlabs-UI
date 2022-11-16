import React, { useState } from "react";

import Modal from "components/Modal";
import { useBridgeContext } from "contexts/BridgeContext";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { getNetworkLabel } from "lib/bridge/helpers";

type NeedsConfirmationModalProps = {
  setNeedsConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<any>>;
};

const NeedsConfirmationModal = ({ setNeedsConfirmation, setMessage }: NeedsConfirmationModalProps) => {
  const { foreignChainId } = useBridgeDirection();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { fromToken, toToken, setTxHash } = useBridgeContext();
  const toUnit = (toToken !== undefined && toToken?.symbol) || (fromToken !== undefined && fromToken?.symbol);

  const [isOpen, setOpen] = useState(true);

  const onClose = () => {
    setNeedsConfirmation(false);
    setTxHash(undefined);
    setMessage(undefined);
    setOpen(false);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-4 font-brand">
        <h5 className="mb-2 text-2xl dark:text-slate-400">Claim Your Tokens</h5>
        <p className="flex py-3 dark:text-gray-500">
          Please switch the network in your wallet to
          <div
            onClick={() => {
              if (canSwitch) switchNetwork(foreignChainId);
            }}
          >
            <strong>{getNetworkLabel(foreignChainId)}</strong>
          </div>
          {!canSwitch && <>Unable to switch network. Please try it on your wallet</>}
        </p>
        <p>
          After you switch networks, you will complete a second transaction on {getNetworkLabel(foreignChainId)} to
          claim your {toUnit} tokens.
        </p>
      </div>
    </Modal>
  );
};

export default NeedsConfirmationModal;

import React from "react";
import { ChainId } from "@brewlabs/sdk";
import Modal from "components/Modal";
import { NetworkConfig } from "config/constants/types";


type SwitchNetworkModalProps = {
  networks: NetworkConfig[];
  loading?: boolean;
  onSelected: (selectedChain: ChainId) => void;
  onDismiss: () => void;
};

const SwitchNetworkModal = ({ networks, onSelected, onDismiss }: SwitchNetworkModalProps) => {
  return (
    <Modal closeFn={onDismiss} layoutId="switch-network" disableAutoCloseOnClick>
      <div className="p-4 font-brand">
        <h5 className="mb-2 text-2xl">Switch Network</h5>
        <p className="dark:text-gray-500">Select a network</p>

        <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
          {networks.map((network) => (
            <li key={network.id}>
              <button
                onClick={() => onSelected(network.id)}
                className="flex w-full from-zinc-900 via-zinc-800 to-zinc-900 py-4 hover:bg-gradient-to-r"
              >
                <img className="h-10 w-10 rounded-full" src={network.image} alt="" />
                <div className="ml-4 flex-col text-left">
                  <p className="text-sm font-medium text-gray-900">{network.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-500">Current price:0000</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default SwitchNetworkModal;

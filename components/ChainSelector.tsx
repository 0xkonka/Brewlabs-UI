import React from "react";
import { NetworkConfig } from "config/constants/types";

type ChainSelectorProps = {
  onDismiss?: () => void;
  networks: NetworkConfig[];
  selectFn: (selectedNetwork: NetworkConfig) => void;
};

const ChainSelector = ({ networks, selectFn, onDismiss }: ChainSelectorProps) => {
  return (
    <div className="p-4 font-brand">
      <h5 className="mb-2 text-2xl dark:text-slate-400">Networks</h5>
      <p className="dark:text-gray-500">Select a network to send fund from</p>

      <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {networks.map((network) => (
          <li key={network.name}>
            <button
              onClick={() => {
                selectFn(network);
                if (onDismiss) onDismiss();
              }}
              className="flex w-full py-4 hover:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
            >
              <img className="h-10 w-10 rounded-full" src={network.image} alt={network.name} />
              <div className="ml-4 flex-col text-left">
                <p className="text-sm font-medium text-gray-900">{network.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-500">Current price:0000</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChainSelector;

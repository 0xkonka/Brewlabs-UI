import React from "react";
import { networks } from "../config/constants/networks";

type ChainSelectorProps = {
  selectFn: (selectedValue: string) => void;
  onDismiss?: () => void;
};

const ChainSelector = ({ selectFn, onDismiss }: ChainSelectorProps) => {
  return (
    <div className="p-4 font-brand">
      <h5 className="mb-2 text-2xl">Networks</h5>
      <p className="dark:text-gray-500">Select a network to send fund from</p>

      <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
        {networks.map((network) => (
          <li key={network.name}>
            <button
              onClick={() => {
                selectFn(network.name);
                if (onDismiss) onDismiss();
              }}
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
  );
};

export default ChainSelector;

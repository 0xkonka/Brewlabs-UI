import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { BeakerIcon } from "@heroicons/react/24/outline";

import { bsc } from "contexts/wagmi";

import Modal from "../Modal";
import { setGlobalState } from "../../state";
import WalletSelector from "./WalletSelector";

interface ConnectWalletProps {
  allowDisconnect?: boolean;
}

const ConnectWallet = ({ allowDisconnect }: ConnectWalletProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isLoading } = useConnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // When mounted on client, now we can show the UI
  // Solves Next hydration error
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (chain?.unsupported && switchNetwork) {
      switchNetwork(bsc.id);
    }
  }, [chain?.unsupported, bsc, switchNetwork]);

  if (!mounted) return null;

  return (
    <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
      {open && (
        <Modal closeFn={() => setOpen(false)} layoutId="wallet-connect">
          <WalletSelector onDismiss={() => setOpen(false)} />
        </Modal>
      )}
      {!isConnected ? (
        <button onClick={() => setOpen(true)} className="group block w-full flex-shrink-0">
          <div className="flex animate-pulse items-center">
            <div className="rounded-full border-2 border-dark p-2">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {open ? `Connecting wallet` : `Connect wallet`}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Connect to interact</p>
            </div>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setGlobalState("userSidebarOpen", !allowDisconnect)}
          className="group block w-full flex-shrink-0"
        >
          <div className="flex items-center">
            <div className="rounded-full border-2 border-dark p-2 dark:border-brand">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3 overflow-hidden" onClick={() => allowDisconnect && disconnect()}>
              <p className="truncate text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100">
                {isLoading ? "..." : address}
              </p>
              <p className="text-left text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100">
                {allowDisconnect ? `Disconnect` : `Connected`}
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;

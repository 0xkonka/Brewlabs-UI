import { useEffect, useState } from "react";
import { setGlobalState } from "../state";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const ConnectWallet = () => {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  // When mounted on client, now we can show the UI
  // Solves Next hydration error
  useEffect(() => setMounted(true), []);

  const { connect, isLoading } = useConnect({
    connector: new InjectedConnector(),
  });

  if (!mounted) return null;

  return (
    <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
      {!isConnected ? (
        <button
          onClick={() => connect()}
          className="group block w-full flex-shrink-0"
        >
          <div className="flex animate-pulse items-center">
            <div className="rounded-full border-2 border-dark p-2">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Connect wallet
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                Connect to interact
              </p>
            </div>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setGlobalState("userSidebarOpen", true)}
          className="group block w-full flex-shrink-0"
        >
          <div className="flex items-center">
            <div className="rounded-full border-2 border-dark p-2 dark:border-brand">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100">
                {isLoading ? "..." : address}
              </p>
              <p className="text-left text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100">
                Connected
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;

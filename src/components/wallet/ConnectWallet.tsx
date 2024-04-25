import { useEffect, useState } from "react";
import clsx from "clsx";
import { WalletIcon } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";

import UserDashboard from "components/dashboard/UserDashboard";
import { NetworkOptions } from "config/constants/networks";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useActiveChainId } from "hooks/useActiveChainId";
import { setUserSidebarOpen, setUserSidebarContent } from "state";

import SwitchNetworkModal from "../network/SwitchNetworkModal";
import WrongNetworkModal from "../network/WrongNetworkModal";

interface ConnectWalletProps {
  allowDisconnect?: boolean;
}

const ConnectWallet = ({ allowDisconnect }: ConnectWalletProps) => {
  const { address, isConnected, isConnecting, connector } = useAccount();
  const { open } = useWeb3Modal();
  const { isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const supportedNetworks = useSupportedNetworks();
  const { chainId, isWrongNetwork } = useActiveChainId();

  const [mounted, setMounted] = useState(false);
  const [openSwitchNetworkModal, setOpenSwitchNetworkModal] = useState(false);

  // When mounted on client, now we can show the UI
  // Solves Next hydration error
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isConnected && !connector) {
      disconnect();
    }
  }, [isConnected, connector, disconnect]);

  if (!mounted) return null;

  const truncatedAddress = (address: `0x${string}`) =>
    `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;

  return (
    <div className="flex flex-shrink-0 gap-3 border-t border-gray-200 p-4 dark:border-gray-800">
      <SwitchNetworkModal
        open={openSwitchNetworkModal}
        networks={supportedNetworks}
        onDismiss={() => setOpenSwitchNetworkModal(false)}
      />
      <WrongNetworkModal
        open={!!isWrongNetwork || !supportedNetworks.map((network) => network.id).includes(chainId)}
        currentChain={supportedNetworks.find((network) => network.id === chainId) ?? supportedNetworks[0]}
      />

      {!isConnected ? (
        <button
          id="wallet-connect-button"
          type="button"
          onClick={() => {
            open({ view: "Connect" });
          }}
          className="group block w-full flex-shrink-0"
        >
          <div className="flex items-center">
            <div className="relative shrink-0 p-2">
              <div className="absolute inset-0 m-auto h-8 w-8 animate-ping rounded-full border-2 border-brand"></div>
              <WalletIcon className="inline-block h-6 w-6 rounded-full text-yellow-200" />
            </div>

            <div className="ml-3">
              <p className="whitespace-nowrap text-sm font-medium text-gray-700 group-hover:text-gray-500">
                {isConnecting ? `Connecting wallet` : `Connect wallet`}
              </p>
              <p className="whitespace-nowrap text-sm font-medium text-gray-500 group-hover:text-gray-400">
                Connect to interact
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div
              onClick={(e) => {
                if (supportedNetworks.length > 1 && !allowDisconnect) {
                  e.stopPropagation();
                  setOpenSwitchNetworkModal(true);
                }
              }}
              className="rounded-full border-2"
            >
              <div
                className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-dark bg-cover bg-no-repeat p-2 dark:border-brand"
                style={{
                  backgroundImage: `url('${NetworkOptions.find((network) => network.id === chainId)?.image}')`,
                }}
              />
            </div>

            <button
              className="ml-3 overflow-hidden"
              onClick={() => {
                setUserSidebarOpen(!allowDisconnect ? true : false);
                setUserSidebarContent(<UserDashboard />);
              }}
            >
              <p className="truncate text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100">
                {isLoading ? "..." : truncatedAddress(address)}
              </p>
              <p className="whitespace-nowrap text-left text-sm font-medium">
                <span className={clsx(isWrongNetwork ? "text-red-400" : "text-slate-400")}>{chain?.name}</span>
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;

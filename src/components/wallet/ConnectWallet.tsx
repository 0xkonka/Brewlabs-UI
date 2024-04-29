"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { camelCase } from "lodash";
import { cva, type VariantProps } from "class-variance-authority";
import { WalletIcon } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";

import UserDashboard from "components/dashboard/UserDashboard";
import { NetworkOptions } from "config/constants/networks";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useGlobalState } from "state";

import { useSearchParams } from "next/navigation";

import { cn } from "lib/utils";

import SwitchNetworkModal from "../network/SwitchNetworkModal";
import WrongNetworkModal from "../network/WrongNetworkModal";

//Solana
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useSolanaNetwork } from "contexts/SolanaNetworkContext";
import useUserSOLBalanceStore from "../../store/useUserSOLBalanceStore";
import { ChainId } from "@brewlabs/sdk";

interface ConnectWalletProps {
  allowDisconnect?: boolean;
}

interface ConnectWalletProps {
  allowDisconnect?: boolean;
}

const networkIconVariants = cva(
  "h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-dark bg-cover bg-no-repeat p-2 ",
  {
    variants: {
      chain: {
        bnbSmartChain: "border-brand",
        ethereum: "border-indigo-500",
        fantom: "border-blue-400",
        polygon: "border-purple-500",
        avalanche: "border-blue-500",
        cronos: "border-yellow-500",
        brise: "border-yellow-500",
        arbitrum: "border-blue-500",
      },
    },
    defaultVariants: {
      chain: "bnbSmartChain",
    },
  }
);

const ConnectWallet = ({ allowDisconnect }: ConnectWalletProps) => {
  const { address, isConnected, isConnecting, connector } = useAccount();
  const { open } = useWeb3Modal();
  const { isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const supportedNetworks = useSupportedNetworks();
  const { chainId, isWrongNetwork } = useActiveChainId();

  const [mounted, setMounted] = useState(false);
  const [openWrongNetworkModal, setOpenWrongNetworkModal] = useState(false);
  const [openSwitchNetworkModal, setOpenSwitchNetworkModal] = useState(false);

  const [userSidebarOpen, setUserSidebarOpen] = useGlobalState("userSidebarOpen");
  const [userSidebarContent, setUserSidebarContent] = useGlobalState("userSidebarContent");
  // Solana
  const { connected } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { isSolanaNetwork, setIsSolanaNetwork } = useSolanaNetwork();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  // Get URL chainId
  const searchParams = useSearchParams();
  const chainIdFromUrl = Number(searchParams.get("chainId"));

  useEffect(() => {
    // Need to add support check
    // Id URL is 5685 then do nothing
    const urlDoesNotMatchChain = chainIdFromUrl !== undefined && chainIdFromUrl !== chainId;
    if (urlDoesNotMatchChain) {
      setOpenWrongNetworkModal(true);
    }
    if (isWrongNetwork) {
      setOpenWrongNetworkModal(true);
    }
    if (!isWrongNetwork && !urlDoesNotMatchChain) {
      setOpenWrongNetworkModal(false);
    }
  }, [chainId, chainIdFromUrl, isWrongNetwork]);

  // When mounted on client, now we can show the UI
  // Solves Next hydration error
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isConnected && !connector) {
      disconnect();
    }
  }, [isConnected, connector, disconnect]);

  useEffect(() => {
    if (chainId === (900 as ChainId)) {
      setIsSolanaNetwork(true);
    } else setIsSolanaNetwork(false);
  }, [chainId, setIsSolanaNetwork]);

  useEffect(() => {
    if (wallet.publicKey) {
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

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
      <WrongNetworkModal open={isWrongNetwork} />

      {!isConnected ? (
        <button
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
                className={cn(
                  networkIconVariants({
                    chain: camelCase(chain?.name.toLowerCase()) as VariantProps<typeof networkIconVariants>["chain"],
                  })
                )}
                style={{
                  backgroundImage: `url('${NetworkOptions.find((network) => network.id === chainId)?.image}')`,
                }}
              />
            </div>

            <button
              className="ml-3 overflow-hidden"
              onClick={() => {
                setUserSidebarOpen(!allowDisconnect ? 1 : 0);
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

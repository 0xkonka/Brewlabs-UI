import { useEffect, useState } from "react";
import clsx from "clsx";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";

import { NetworkOptions } from "config/constants/networks";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useActiveChainId } from "hooks/useActiveChainId";

import { setGlobalState } from "../../state";
import SwitchNetworkModal from "../network/SwitchNetworkModal";
import WrongNetworkModal from "../network/WrongNetworkModal";
import Modal from "../Modal";
import WalletSelector from "../wallet/WalletSelector";
import StyledButton from "./StyledButton";
import { NoneSVG, LinkSVG } from "./assets/svgs";
import styled from "styled-components";

interface ConnectWalletProps {
  allowDisconnect?: boolean;
}

const ConnectWallet = ({ allowDisconnect }: ConnectWalletProps) => {
  const { address, isConnected } = useAccount();
  const { isLoading } = useConnect();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const supportedNetworks = useSupportedNetworks();
  const { chainId, isWrongNetwork } = useActiveChainId();

  const [mounted, setMounted] = useState(false);

  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [openSwitchNetworkModal, setOpenSwitchNetworkModal] = useState(false);

  // When mounted on client, now we can show the UI
  // Solves Next hydration error
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex w-full flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-800">
      <Modal open={openWalletModal} onClose={() => !isLoading && setOpenWalletModal(false)}>
        <WalletSelector onDismiss={() => setOpenWalletModal(false)} />
      </Modal>
      <SwitchNetworkModal
        open={openSwitchNetworkModal}
        networks={supportedNetworks}
        onDismiss={() => setOpenSwitchNetworkModal(false)}
      />
      <WrongNetworkModal
        open={!!isWrongNetwork}
        currentChain={supportedNetworks.find((network) => network.id === chainId) ?? supportedNetworks[0]}
      />

      {!isConnected ? (
        <button
          onClick={() => {
            setOpenWalletModal(true);
          }}
          className="group block w-full flex-shrink-0"
        >
          <div className="flex animate-pulse items-center">
            <div className="rounded-full border-2 border-dark p-2">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-500">
                {openWalletModal ? `Connecting wallet` : `Connect wallet`}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-400">Connect to interact</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="group block flex w-full flex-shrink-0 items-center justify-between">
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
                className="h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 border-dark bg-cover bg-no-repeat p-2 dark:border-brand"
                style={{
                  backgroundImage: `url('${NetworkOptions.find((network) => network.id === chainId)?.image}')`,
                }}
              />
            </div>

            <MaxWidthButton
              className="ml-3 overflow-hidden"
              onClick={() => setGlobalState("userSidebarOpen", !allowDisconnect)}
            >
              <p className="truncate text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100">
                {isLoading ? "..." : address}
              </p>
              <p className="text-left text-xs font-medium">
                <span className={clsx(isWrongNetwork ? "text-red-400" : "text-slate-400")}>{chain?.name}</span>
              </p>
            </MaxWidthButton>
          </div>
          <div>
            <div className={"h-[15px] w-[83px]"}>
              <StyledButton onClick={() => disconnect()}>
                <div className={"flex items-center"}>
                  {LinkSVG}
                  <div className={"ml-0.5"}>Disconnect</div>
                </div>
              </StyledButton>
            </div>
            <div className={"mt-2 flex h-[15px] w-[83px] items-center"}>
              <StyledButton>
                <div className={"flex items-center"}>
                  {NoneSVG}
                  <div className={"ml-0.5"}>Revoke All</div>
                </div>
              </StyledButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MaxWidthButton = styled.button`
  max-width: calc(100vw - 250px);
`;

export default ConnectWallet;

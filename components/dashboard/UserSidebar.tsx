import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useGlobalState, setGlobalState } from "../../state";
import ConnectWallet from "./ConnectWallet";
import LogoIcon from "../LogoIcon";
import WalletData from "./UserData";
import DisconnectWalletButton from "components/wallet/DisconnectWalletButton";
import StyledButton from "./StyledButton";
import PerformanceChart from "./PerformanceChart";
import SwitchButton from "./SwitchButton";
import TokenList from "./TokenList";
import FullOpenVector from "./FullOpenVector";

const UserSidebar = () => {
  const [isOpen] = useGlobalState("userSidebarOpen");
  const [showType, setShowType] = useState(0);
  const [fullOpen, setFullOpen] = useState(false);

  const tokens = [
    {
      name: "Brewlabs",
      symbol: "BREWLABS",
      isVerified: true,
      balance: 8282810.22,
      price: 0.044,
      value: 42422.22,
      isReward: true,
      isPriceUp: true,
      isScam: false,
      logo: "/images/dashboard/tokens/brewlabs.svg",
      reward: {
        totalRewards: 422.22,
        pendingRewards: 20.22,
        symbol: "BUSD",
      },
    },
    {
      name: "BNB",
      symbol: "BNB",
      isVerified: true,
      balance: 9282810.22,
      price: 0.044,
      value: 32442.22,
      isReward: false,
      isPriceUp: true,
      isScam: false,
      logo: "/images/dashboard/tokens/brewlabs.svg",
      reward: {
        totalRewards: 0,
        pendingRewards: 0,
        symbol: "",
      },
    },
    {
      name: "Sky Token",
      symbol: "TICKER",
      isVerified: false,
      balance: 8282810.22,
      price: 0.044,
      value: 32442.22,
      isReward: true,
      isPriceUp: false,
      isScam: false,
      logo: "/images/dashboard/tokens/brewlabs.svg",
      reward: {
        totalRewards: 2923,
        pendingRewards: 5,
        symbol: "SKY",
      },
    },
    {
      name: "I'm a scam token",
      symbol: "TICKER",
      isVerified: false,
      balance: 325612.22,
      price: 0.13,
      value: 4432.22,
      isReward: true,
      isPriceUp: false,
      isScam: true,
      logo: "/images/dashboard/tokens/brewlabs.svg",
      reward: {
        totalRewards: 1,
        pendingRewards: 532,
        symbol: "TICKER",
      },
    },
    {
      name: "Scam token",
      symbol: "TICKER",
      isVerified: false,
      balance: 325612.22,
      price: 0.13,
      value: 4432.22,
      isReward: true,
      isPriceUp: false,
      isScam: true,
      logo: "/images/dashboard/tokens/brewlabs.svg",
      reward: {
        totalRewards: 1,
        pendingRewards: 532,
        symbol: "TICKER",
      },
    },
    {
      name: "Another Scam token",
      symbol: "TICKER",
      isVerified: false,
      balance: 325612.22,
      price: 0.13,
      value: 32.22,
      isReward: true,
      isPriceUp: false,
      isScam: true,
      logo: "/images/dashboard/tokens/brewlabs.svg",
      reward: {
        totalRewards: 1,
        pendingRewards: 56,
        symbol: "TICKER",
      },
    },
  ];
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={() => setGlobalState("userSidebarOpen", false)}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex font-dash">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-[600px] flex-1 flex-col  items-center bg-white px-2 focus:outline-none dark:border-gray-800 dark:bg-zinc-900 xmd:px-3">
              <div className="flex h-full w-full flex-1 flex-col  items-center">
                <div className="relative mr-1.5 flex w-full max-w-lg flex-col  pt-16 pb-3">
                  <div className="flex w-full items-center border-b border-yellow pb-4">
                    <LogoIcon classNames="w-14 text-dark dark:text-brand" />
                    <div className={"ml-5 text-2xl font-semibold text-yellow"}>Dashboard</div>
                  </div>

                  <div className={"mt-3 h-[25px] w-40"}>
                    <StyledButton onClick={() => {}}>Portfolio</StyledButton>
                  </div>

                  <div className={"mt-10"}>
                    <PerformanceChart pricehistory={[10000, 20000, 50000, 60000, 20000, 30224.22]} />
                  </div>

                  <div className={"flex w-full justify-center"}>
                    <SwitchButton value={showType} setValue={setShowType} />
                  </div>
                </div>
                <TokenList tokens={tokens} showType={showType} fullOpen={fullOpen} />

                <div className={"mb-3 w-full max-w-[512px]"}>
                  <FullOpenVector open={fullOpen} setOpen={setFullOpen} />
                </div>
              </div>
              <ConnectWallet allowDisconnect />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UserSidebar;

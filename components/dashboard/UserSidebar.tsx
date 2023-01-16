/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useGlobalState, setGlobalState } from "../../state";
import ConnectWallet from "./ConnectWallet";
import LogoIcon from "../LogoIcon";
import StyledButton from "./StyledButton";
import PerformanceChart from "./PerformanceChart";
import SwitchButton from "./SwitchButton";
import TokenList from "./TokenList";
import FullOpenVector from "./FullOpenVector";
import { DashboardContext } from "contexts/DashboardContext";

const UserSidebar = () => {
  const [isOpen] = useGlobalState("userSidebarOpen");
  const [showType, setShowType] = useState(0);
  const [fullOpen, setFullOpen] = useState(false);
  const { tokens }: any = useContext(DashboardContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    setItemsPerPage(Math.min(Math.floor((window.innerHeight - 650) / 50), 7));
  }, [fullOpen]);

  useEffect(() => {
    let filteredTokens: any = [];
    if (listType === 0) {
      filteredTokens = tokens.filter((data: any) => !archives.includes(data.address));
    } else {
      filteredTokens = tokens.filter((data: any) => archives.includes(data.address));
    }
    setMaxPage(Math.ceil(filteredTokens.length / itemsPerPage));
  }, [listType, tokens, archives]);

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

        <div className="fixed inset-0 z-40 flex font-roboto">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-[750px] flex-1 flex-col  items-center bg-white px-2 focus:outline-none dark:border-gray-800 dark:bg-zinc-900 xmd:px-2 xmd:px-4">
              <div className="absolute top-0 right-0 z-10 pt-2 sm:-mr-12">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-inset focus:ring-white sm:focus:ring-2"
                  onClick={() => setGlobalState("userSidebarOpen", false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex h-full w-full flex-1 flex-col  items-center ">
                <div className="relative mr-1.5 flex w-full  flex-col  pt-16 pb-3">
                  <div className="flex w-full items-center border-b border-yellow pb-4">
                    <LogoIcon classNames="w-14 text-dark dark:text-brand" />
                    <div className={"ml-5 text-2xl font-semibold text-yellow"}>Dashboard</div>
                  </div>

                  <div className={"mt-3 h-[30px] w-40"}>
                    <StyledButton onClick={() => {}}>Portfolio</StyledButton>
                  </div>

                  <div className={"mt-7"}>
                    <PerformanceChart tokens={tokens} showType={showType} />
                  </div>

                  <div className={"relative z-10 flex w-full justify-center"}>
                    <SwitchButton value={showType} setValue={setShowType} />
                  </div>
                </div>
                <TokenList
                  tokens={tokens}
                  showType={showType}
                  fullOpen={fullOpen}
                  pageIndex={pageIndex}
                  setPageIndex={setPageIndex}
                  itemsPerPage={itemsPerPage}
                  archives={archives}
                  setArchives={setArchives}
                  listType={listType}
                  setListType={setListType}
                />

                <div className={"mb-3 w-full"}>
                  <FullOpenVector
                    open={fullOpen}
                    setOpen={setFullOpen}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    maxPage={maxPage}
                  />
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

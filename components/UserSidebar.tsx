import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useMoralis } from "react-moralis";
import { BeakerIcon } from "@heroicons/react/outline";
import LogoIcon from "./LogoIcon";

import { useGlobalState, setGlobalState } from "../state";
import WalletData from "./WalletData";

const UserSidebar = () => {
  const [isOpen] = useGlobalState("userSidebarOpen");

  const { user, logout } = useMoralis();

  const disconnect = async () => {
    await logout();
    setGlobalState("userSidebarOpen", false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        onClose={() => setGlobalState("userSidebarOpen", false)}
      >
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

        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex-1 flex flex-col max-w-md w-full bg-white focus:outline-none">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setGlobalState("userSidebarOpen", false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <LogoIcon classNames="w-12 text-dark" />
                </div>

                {/* <WalletData address={user?.get("ethAddress")} /> */}
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button
                  onClick={disconnect}
                  className="flex-shrink-0 w-full group block"
                >
                  <div className="flex items-center">
                    <div className="border-2 border-dark rounded-full p-2">
                      <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium truncate text-gray-700 group-hover:text-gray-900">
                        {user?.get("ethAddress")}
                      </p>
                      <p className="text-xs text-left font-medium text-gray-500 group-hover:text-gray-700">
                        Disconnect
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UserSidebar;

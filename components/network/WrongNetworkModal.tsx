import React, { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { useNetwork } from "wagmi";

import { NetworkOptions } from "config/constants/networks";
import { NetworkConfig } from "config/constants/types";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";

import Modal from "components/Modal";

type WrongNetworkModalProps = {
  currentChain?: NetworkConfig;
};

const WrongNetworkModal = ({ currentChain }: WrongNetworkModalProps) => {
  const { canSwitch, switchNetwork, isLoading, error } = useSwitchNetwork();
  const { chain } = useNetwork();

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (error) {
      setErrorMsg(error?.message ?? "");
    } else setErrorMsg("");
  }, [error]);

  return (
    <Modal closeFn={() => {}} layoutId="switch-network" disableAutoCloseOnClick>
      <div className="p-4 font-brand">
        <h5 className="mb-2 text-2xl">You are in wrong network</h5>

        {errorMsg && (
          <div className="relative mt-2 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
            <strong className="font-bold">{errorMsg}</strong>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMsg("")}>
              <svg
                className="h-6 w-6 fill-current text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        <p className="mt-2">{`This page is located for ${currentChain?.name}.`}</p>
        <p>{`You are under ${chain?.name ?? ""} now, please switch the network to continue.`}</p>
        <div className="mt-5 text-center">
          <div className="mb-3 flex items-center text-center">
            <img
              className="ml-auto mr-3 h-10 w-10 rounded-full"
              src={NetworkOptions.find((n) => n.id === chain?.id)?.image}
              alt=""
            />
            <span>{"=>"}</span>
            <img className="ml-3 mr-auto h-10 w-10 rounded-full" src={currentChain?.image} alt="" />
          </div>

          {canSwitch ? (
            <button
              className="dark:text-white-700 m-auto flex items-center rounded border border-blue-500 bg-transparent py-2 px-4 hover:border-transparent hover:bg-blue-500 hover:text-white"
              disabled={isLoading}
              onClick={() => switchNetwork(currentChain?.id || ChainId.BSC_MAINNET)}
            >
              <div>Switch to {currentChain?.name}</div>
              <div className="ml-2">
                {isLoading && (
                  <div role="status">
                    <svg
                      className="mr-2 inline h-8 w-8 animate-spin fill-yellow-500 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ) : (
            <div
              className="relative mt-2 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <strong className="font-bold">Unable to switch network. Please try it on your wallet</strong>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WrongNetworkModal;

import { ReactElement, ReactNode, useState } from "react";
import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

import { useUserSlippageTolerance } from "state/user/hooks";

type ModalProps = {
  open: boolean;
  autoMode: boolean;
  setAutoMode: (autoMode: boolean) => void;
  slippage: number;
  slippageInput: string;
  parseCustomSlippage: (slippage: string) => void;
  onClose: () => void;
};

const SettingModal = ({
  open,
  autoMode,
  setAutoMode,
  slippage,
  slippageInput,
  parseCustomSlippage,
  onClose,
}: ModalProps): ReactElement | null => {
  const [userSlippageTolerance] = useUserSlippageTolerance();

  const spring = {
    type: "spring",
    stiffness: 1200,
    damping: 30,
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.75,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  ease: "easeOut",
                  duration: 0.15,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
                transition: {
                  ease: "easeIn",
                  duration: 0.15,
                },
              }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative w-full md:min-w-[500px] md:max-w-[500px]">
                <div className="m-2 overflow-hidden rounded-lg bg-white px-8 py-4 font-brand dark:bg-[#181c25]">
                  <div className="title flex items-center justify-between pl-3">
                    <p className="text-[21px] dark:text-white">Settings</p>
                    <XMarkIcon className="h-6 w-6 cursor-pointer dark:text-slate-400" onClick={onClose} />
                  </div>
                  <div className="slippage-tab mt-2 flex items-center justify-between rounded-xl p-4 dark:bg-[#180404] dark:bg-opacity-20">
                    <div className="text-[16px] dark:text-white hidden sm:block">
                      <p className="flex items-center justify-between gap-1">
                        Slippage tolerance{" "}
                        <ExclamationCircleIcon
                          className="h-4 w-4 dark:text-white"
                          data-tooltip-target="tooltip-default"
                        />
                      </p>
                    </div>
                    <div className="relative grid grid-flow-col grid-cols-2 rounded-full border text-center dark:border-primary dark:text-white">
                      <motion.div
                        layout
                        transition={spring}
                        className={`absolute flex h-full w-1/2 rounded-full bg-primary ${
                          autoMode ? "justify-self-start" : "justify-self-end"
                        }`}
                      ></motion.div>
                      <span
                        onClick={() => setAutoMode(true)}
                        className="z-10 flex cursor-pointer justify-center px-4 dark:text-white"
                      >
                        Auto
                      </span>
                      <span
                        onClick={() => setAutoMode(false)}
                        className="z-10 flex cursor-pointer justify-center px-4 dark:text-white"
                      >
                        Custom
                      </span>
                    </div>
                  </div>
                  <div className="slippage-tab mt-2 flex items-center justify-between rounded-xl px-4 py-2 dark:bg-[#180404] dark:bg-opacity-20">
                    <div className="text-[16px] dark:text-white hidden sm:block">
                      <p className="flex items-center justify-between gap-1">
                        Custom slippage{" "}
                        <ExclamationCircleIcon
                          className="h-4 w-4 dark:text-white"
                          data-tooltip-target="tooltip-default"
                        />
                      </p>
                    </div>
                    <input
                      type="text"
                      value={autoMode ? (slippage / 100).toFixed(2) : slippageInput}
                      onBlur={() => parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))}
                      onChange={(e) => parseCustomSlippage(e.target.value)}
                      placeholder={(autoMode ? slippage / 100 : userSlippageTolerance / 100).toFixed(2)}
                      className="foucus:outline-none max-w-[180px] rounded-xl bg-transparent text-end text-white outline-0 dark:border-primary"
                      disabled={autoMode}
                    ></input>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SettingModal;

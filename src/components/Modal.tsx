import { ReactElement, ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

import { BackgroundGradient } from "@components/ui/background-gradient";

type ModalProps = {
  open: boolean;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
};

const Modal = ({ open, children, onClose, className }: ModalProps): ReactElement | null => {
  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog open={open} className={twMerge("relative z-50", className)} onClose={onClose ? onClose : () => {}}>
        <div className="fixed inset-0 overflow-y-auto bg-gray-300 bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-80">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <BackgroundGradient className="rounded-[22px] bg-zinc-900 ">
              <div className="relative w-full md:min-w-[600px] md:max-w-lg">
                <Dialog.Panel>
                  {children}

                  {onClose && (
                    <button
                      onClick={onClose}
                      className="absolute right-4 top-4 rounded-full bg-zinc-900 p-2 ring ring-yellow-200 sm:-right-4 sm:-top-4"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6 text-yellow-200" />
                    </button>
                  )}
                </Dialog.Panel>
              </div>
            </BackgroundGradient>
          </div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

export default Modal;

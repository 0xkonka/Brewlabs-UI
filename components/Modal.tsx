import { ReactElement, ReactEventHandler, ReactNode, useEffect } from "react";
import { Portal } from "react-portal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardEvent {
  key: string;
}

type ModalProps = {
  layoutId: string;
  children?: ReactNode;
  disableAutoCloseOnClick?: boolean;
  closeFn: ReactEventHandler;
};

const Modal = ({
  closeFn,
  layoutId,
  children,
  disableAutoCloseOnClick,
}: ModalProps): ReactElement | null => {
  useEffect(() => {
    // Function to close on Esc
    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFn;
      }
    };
    // Add event listener for keydown
    document.addEventListener("keydown", handleEscClose, false);

    return () => {
      // Remove event listener for keydown
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [closeFn]);

  return (
    <AnimatePresence exitBeforeEnter>
      <Portal node={document && document.getElementById("page_wrapper")}>
        <motion.div
          onClick={closeFn}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 z-10 h-full w-full bg-zinc-900 bg-opacity-90"
        >
          <motion.div
            layout
            layoutId={layoutId}
            onClick={(e) => disableAutoCloseOnClick && e.stopPropagation()}
            className="z-90 absolute inset-x-0 top-32 m-auto h-fit sm:w-7/12 md:w-2/6 md:min-w-[400px]"
          >
            <div className="overflow-hidden rounded-xl border-2 border-amber-300 bg-gray-600 bg-opacity-60 dark:bg-zinc-900">
              {children}
            </div>

            <motion.button
              onClick={closeFn}
              className="absolute -top-2 -right-2 rounded-full bg-white p-2 dark:bg-zinc-900"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </Portal>
    </AnimatePresence>
  );
};

export default Modal;

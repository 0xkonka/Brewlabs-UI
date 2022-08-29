import {
  ReactElement,
  ReactEventHandler,
  SyntheticEvent,
  ReactNode,
  useEffect,
} from "react";
import { Portal } from "react-portal";
import { XIcon } from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardEvent {
  key: string;
}

type ModalProps = {
  layoutId: string;
  children?: ReactNode;
  closeFn: ReactEventHandler;
};

const Modal = ({
  closeFn,
  layoutId,
  children,
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
          className="bg-dark bg-opacity-90 w-full h-full absolute top-0 left-0"
        >
          <motion.div
            layout
            layoutId={layoutId}
            className="absolute inset-x-0 top-32 m-auto z-90  w-7/12 h-fit"
          >
            <div className="rounded-xl overflow-hidden border-2 border-gray-500 bg-gray-600">
              {children}
            </div>

            <motion.button
              onClick={closeFn}
              className="absolute -top-2 -right-2 rounded-full p-2 bg-white"
            >
              <span className="sr-only">Close</span>
              <XIcon className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </Portal>
    </AnimatePresence>
  );
};

export default Modal;

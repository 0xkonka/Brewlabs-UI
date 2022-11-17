import { ReactElement, ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Modal from "../MotionModal";

type CryptoCardProps = {
  id: string;
  title?: string;
  active?: boolean;
  tokenPrice: number;
  children: ReactNode;
  modal: {
    disableAutoCloseOnClick?: boolean;
    openModal?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    buttonText: string;
    modalContent: ReactElement;
  };
};

const CryptoCard = ({ id, title, tokenPrice, modal, active, children }: CryptoCardProps) => {
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    if (modal.onClose) {
      modal.onClose();
    }
    setSelected(false);
  };

  useEffect(() => {
    setSelected(!!modal?.openModal);
  }, [modal?.openModal]);
  console.log("#############", modal?.buttonText, modal.buttonText === "" ? "No network selected" : modal.buttonText);
  return (
    <>
      <motion.div
        layoutId={id}
        whileHover={{ scale: 1.05 }}
        className={clsx(
          "max-w-sm rounded-3xl border-2 border-transparent font-brand focus-within:border-amber-300 hover:border-amber-300 sm:relative sm:max-w-screen-md",
          active && "shake"
        )}
      >
        <div
          className={`h-72 rounded-3xl border-t border-slate-100 bg-gray-50 shadow-lg shadow-indigo-500/50 dark:border-slate-600 dark:bg-zinc-900`}
        >
          <div className="p-10">
            <header className="text-center text-gray-700 dark:text-gray-500">
              <h4 className="text-2xl">{title}</h4>

              {modal?.buttonText !== undefined && (
                <button
                  className="rounded-md border border-dashed border-gray-500 py-1 px-2"
                  onClick={() => {
                    setSelected(true);
                    if (modal.onOpen) modal.onOpen();
                  }}
                >
                  {modal.buttonText === "" ? "No network selected" : modal.buttonText}
                </button>
              )}
            </header>

            {children}

            <h5 className="mt-6 text-center dark:text-gray-500">Current price: {tokenPrice}</h5>
          </div>
        </div>
      </motion.div>

      {selected && modal && (id === "bridge_card_to" || modal.openModal) && (
        <Modal closeFn={closeSelected} layoutId={id} disableAutoCloseOnClick={modal.disableAutoCloseOnClick}>
          {modal.modalContent}
        </Modal>
      )}
    </>
  );
};

export default CryptoCard;

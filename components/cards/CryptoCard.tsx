import { ReactElement, ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Modal from "../MotionModal";

type CryptoCardProps = {
  id: string;
  title?: string;
  active?: boolean;
  children: ReactNode;
  modal: {
    disableAutoCloseOnClick?: boolean
    openModal?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    buttonText: string;
    modalContent: ReactElement;
  };
};

const CryptoCard = ({ id, title, modal, active, children }: CryptoCardProps) => {
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    if (modal.onClose) {
      modal.onClose();
    }
    setSelected(false);
  };

  useEffect(() => {
    if (modal?.openModal) {
      setSelected(true);
    }
  }, [modal?.openModal]);

  return (
    <>
      <motion.div
        layoutId={id}
        whileHover={{ scale: 1.05 }}
        className={clsx(
          "relative col-span-4 max-w-screen-md rounded-3xl border-2 border-transparent font-brand focus-within:border-amber-300 hover:border-amber-300",
          active && "shake"
        )}
      >
        <div className="h-72 rounded-3xl border-t border-slate-100 bg-slate-300 bg-opacity-60 shadow-lg dark:border-slate-600 dark:bg-zinc-900 dark:bg-opacity-60">
          <div className="p-10">
            <header className="text-center">
              <h4 className="text-2xl text-slate-600 dark:text-slate-300">{title}</h4>

              {modal?.buttonText && (
                <button
                  className="underline text-gray-400"
                  onClick={() => {
                    setSelected(true);
                    if(modal.onOpen) modal.onOpen()
                  }}
                >
                  {modal.buttonText}
                </button>
              )}
            </header>

            {children}

            <h5 className="mt-6 text-center dark:text-gray-500">Current price: 0.056</h5>
          </div>
        </div>
      </motion.div>

      {selected && modal && (
        <Modal closeFn={closeSelected} layoutId={id} disableAutoCloseOnClick={modal.disableAutoCloseOnClick}>
          {modal.modalContent}
        </Modal>
      )}
    </>
  );
};

export default CryptoCard;

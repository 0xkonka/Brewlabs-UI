import { ReactElement, ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { NetworkConfig } from "config/constants/types";
import Modal from "../MotionModal";

type CryptoCardProps = {
  id: string;
  title?: string;
  active?: boolean;
  tokenPrice: number;
  children: ReactNode;
  network: NetworkConfig;
  modal: {
    disableAutoCloseOnClick?: boolean;
    openModal?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    buttonText: string;
    modalContent: ReactElement;
  };
};

const CryptoCard = ({ id, title, tokenPrice, modal, active, network, children }: CryptoCardProps) => {
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
  
  return (
    <>
      <motion.div
        layoutId={id}
        className={clsx(
          "max-w-sm rounded-3xl border-2 border-transparent font-brand focus-within:border-amber-300 hover:border-amber-300 sm:relative sm:max-w-screen-md",
          active && "shadow-xl shadow-indigo-400/60"
        )}
      >
        <div className="h-72 rounded-3xl border-t border-slate-100 bg-gray-50 shadow-lg shadow-indigo-500/20 dark:border-slate-600 dark:bg-zinc-900">
          <div className="p-10">
            <header className="text-center text-gray-700 dark:text-gray-500">
              <h4 className="text-2xl">{title}</h4>

              <button
                className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-gray-700"
                onClick={() => {
                  setSelected(true);
                  if (modal.onOpen) modal.onOpen();
                }}
              >
                {network.image !== "" && (
                  <div
                    className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
                    style={{
                      backgroundImage: `url('${network.image}')`,
                    }}
                  ></div>
                )}
                <span className="px-4">{network.name === "" ? "No network selected" : network.name}</span>
              </button>
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

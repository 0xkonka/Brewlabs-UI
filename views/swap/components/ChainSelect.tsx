import { ReactElement, useEffect, useMemo, useState } from "react";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { useNetwork } from "wagmi";
import { motion } from "framer-motion";

import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

import Card from "./Card";
import Modal from "components/MotionModal";
import ChainSelector from "components/ChainSelector";

type ChainSelectProps = {
  id: string;
};

const ChainSelect = ({ id }: ChainSelectProps) => {
  const { chain } = useNetwork();
  const supportedNetworks = useSupportedNetworks();
  const { switchNetwork } = useSwitchNetwork();
  const network = useMemo(() => {
    return supportedNetworks.find((network) => network.id === chain?.id) || supportedNetworks[0];
  }, [chain, supportedNetworks]);
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    setSelected(false);
  };

  const active = false;

  return (
    <>
      <motion.div
        layoutId={id}
        className="px-4 py-2 text-gray-400 bg-opacity-60 font-brand dark:bg-zinc-900 dark:bg-opacity-60 dark:text-white max-w-sm rounded-lg border-2 border-transparent font-brand focus-within:border-amber-300 hover:border-amber-300 sm:relative sm:max-w-screen-md"
      >
        <button
          className="flex w-full items-center justify-between"
          onClick={() => {
            setSelected(true);
          }}
        >
          <div className="flex gap-2">
            {network && network.image !== "" && (
              <div
                className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
                style={{
                  backgroundImage: `url('${network.image}')`,
                }}
              ></div>
            )}
            <span className="pl-4 pr-1">{!network || network.name === "" ? "Choose a network" : network.name}</span>
          </div>
          <ChevronDownIcon className="ml-2 h-5 w-5 dark:text-brand" />
        </button>
      </motion.div>
      {selected && (
        <Modal closeFn={closeSelected} layoutId={id} disableAutoCloseOnClick={true}>
          <ChainSelector
            bSwitchChain
            networks={supportedNetworks}
            currentChainId={chain?.id}
            onDismiss={() => setSelected(false)}
            selectFn={(selectedValue) => switchNetwork(selectedValue.id)}
          />
        </Modal>
      )}
    </>
  );
};

export default ChainSelect;

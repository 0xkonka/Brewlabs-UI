import { useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";

import Modal from "components/Modal";
import ChainSelector from "components/ChainSelector";

type ChainSelectProps = {
  id: string;
  networks?: {
    id: number;
    name: string;
    image: string;
  }[];
};

const ChainSelect = ({ id, networks }: ChainSelectProps) => {
  const { chainId } = useActiveChainId();
  const { switchNetwork } = useSwitchNetwork();
  const [selected, setSelected] = useState(false);
  const supportedNetworks = useSupportedNetworks();
  // Use the supplied networks if provided, otherwise use the default supported networks
  const listedNetworks = networks ?? supportedNetworks;

  const network = useMemo(() => {
    return supportedNetworks.find((network) => network.id === chainId) || supportedNetworks[0];
  }, [chainId, supportedNetworks]);

  const closeSelected = () => {
    setSelected(false);
  };

  return (
    <>
      <div className="mb-4 h-10 rounded-full border border-gray-600 bg-opacity-60 py-2 pl-2 pr-4 font-brand text-gray-400 focus-within:border-amber-300 hover:border-amber-300 dark:bg-zinc-900 dark:bg-opacity-60 dark:text-white">
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => {
            setSelected(true);
          }}
        >
          <div className="flex gap-2">
            {network && network.image !== "" && (
              <div
                className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url('${network.image}')`,
                }}
              ></div>
            )}
            <span className="pl-4 pr-1">{!network || network.name === "" ? "Choose a network" : network.name}</span>
          </div>
          <ChevronDownIcon className="ml-2 h-5 w-5 dark:text-brand" />
        </button>
      </div>
      {selected && (
        <Modal open={selected} onClose={closeSelected}>
          <ChainSelector
            bSwitchChain
            networks={listedNetworks}
            currentChainId={chainId}
            onDismiss={() => setSelected(false)}
            selectFn={(selectedValue) => switchNetwork(selectedValue.id)}
          />
        </Modal>
      )}
    </>
  );
};

export default ChainSelect;

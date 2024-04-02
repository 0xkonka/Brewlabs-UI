import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EXCHANGE_MAP, FACTORY_ADDRESS_MAP, ROUTER_ADDRESS_MAP } from "@brewlabs/sdk";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import Modal from "components/MotionModal";

import { SUPPORTED_DEXES } from "config/constants/swap";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getDexLogo } from "utils/functions";

const RouterSelect = ({ id, router, setRouter, dexId = undefined, type = "liquidity" }) => {
  const { chainId } = useActiveChainId();
  const [selected, setSelected] = useState(false);

  const [supportedRouters, setSupportedRouters] = useState([]);

  useEffect(() => {
    if (EXCHANGE_MAP[chainId]) {
      setSupportedRouters(EXCHANGE_MAP[chainId].filter((dex) => SUPPORTED_DEXES[type][chainId]?.includes(dex.id)));
    }
  }, [chainId, type]);

  useEffect(() => {
    const exchange = supportedRouters.find((dex) => dex.key.indexOf(dexId) >= 0 || dex.id == dexId);
    if (exchange) {
      setRouter({
        ...exchange,
        address: ROUTER_ADDRESS_MAP[exchange.key]?.[chainId],
        factory: FACTORY_ADDRESS_MAP[exchange.key]?.[chainId],
      });
    } else {
      setRouter({
        ...supportedRouters[0],
        address: ROUTER_ADDRESS_MAP[supportedRouters[0]?.key]?.[chainId],
        factory: FACTORY_ADDRESS_MAP[supportedRouters[0]?.key]?.[chainId],
      });
    }
  }, [chainId, dexId, setRouter, supportedRouters]);

  const handleRouterSelected = (index) => {
    setRouter({
      ...supportedRouters[index],
      address: ROUTER_ADDRESS_MAP[supportedRouters[index]?.key]?.[chainId],
      factory: FACTORY_ADDRESS_MAP[supportedRouters[index]?.key]?.[chainId],
    });

    setSelected(false);
  };

  return (
    <>
      <motion.div className="mb-4 rounded-full border border-gray-600 bg-opacity-60 py-2 pl-2 pr-4 font-brand  text-white focus-within:border-amber-300 hover:border-amber-300 dark:bg-zinc-900 dark:bg-opacity-60">
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => {
            setSelected(true);
          }}
        >
          <div className="flex gap-2">
            <div
              className="-mr-4 h-6 w-6 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
              style={{
                backgroundImage: `url(${getDexLogo(router?.id)})`,
              }}
            ></div>
            <span className="pl-4 pr-1">{router?.name ?? "Unsupported"}</span>
          </div>
          <ChevronDownIcon className="ml-2 h-5 w-5 dark:text-brand" />
        </button>
      </motion.div>
      {selected && (
        <Modal open={selected} closeFn={() => setSelected(false)} layoutId={id} disableAutoCloseOnClick={true}>
          <div className="p-4 font-brand">
            <h5 className="mb-2 text-2xl dark:text-slate-400">Routers</h5>
            <p className="dark:text-gray-500">Select a router</p>

            <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
              {supportedRouters.map((data, index) => (
                <li key={data.id}>
                  <button
                    className="flex w-full items-center py-4 hover:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
                    onClick={() => handleRouterSelected(index)}
                  >
                    <img className="h-10 w-10 rounded-full" src={getDexLogo(data.id)} alt={data.name} />
                    <div className="ml-4 flex-col text-left">
                      <p className="text-sm font-medium text-gray-200">{data.name}</p>
                    </div>

                    <div className="ml-auto">
                      {data.id === router.id && <CheckIcon className="mr-2 h-6 w-6 text-green-600" />}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};

export default RouterSelect;

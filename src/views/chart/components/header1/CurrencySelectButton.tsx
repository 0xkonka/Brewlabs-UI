import { useContext, useEffect, useRef, useState } from "react";
import { useSupportedNetworks } from "@hooks/useSupportedNetworks";
import { useTokenPrices } from "@hooks/useTokenPrice";
import { ChartContext } from "contexts/ChartContext";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import getCurrencyId from "utils/getCurrencyId";
import { ChainId, NATIVE_CURRENCIES } from "@brewlabs/sdk";

const CurrencySelectButton = ({
  onCurrencySelect,
}: {
  onCurrencySelect?: any;
}) => {
  const [open, setOpen] = useState(false);
  const {
    chainId,
    setChainId
  }: any = useContext(ChartContext);

  const supportedNetworks = useSupportedNetworks();
  const tokenPrices = useTokenPrices();

  const dropRef: any = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  const getNetwork = (chainId) => {
    const network = supportedNetworks.filter((network) => chainId == network.id);
    return network[0];
  }
  
  return (
    supportedNetworks.length > 0 ? (
      <div className="flex p-0 h-[34px] w-[125px] flex flex-row items-center justify-center rounded-[6px] bg-[#191d24] max-[480px]:w-full">
        <div onClick={() => setOpen(!open)} ref={dropRef} className="rounded-[8px] relative flex z-10 inline-block w-full z-[100]">
            <div className="flex items-center inline-flex w-full justify-between p-[7px] cursor-pointer">
                <img src={getNetwork(chainId).image} className="w-[22px] h-[22px] p"/>
                <div className="flex flex-col justify-start">
                  <p className="text-[11px] leading-[12px] font-[700] text-white">{getNetwork(chainId).name}</p>
                  <p className="text-[11px] leading-[12px] font-[700]">
                  ${tokenPrices[
                    getCurrencyId(
                      chainId,
                      NATIVE_CURRENCIES[chainId === 0 ? ChainId.BSC_MAINNET : chainId].wrapped.address
                    )
                  ]?.toFixed(5) ?? "0.000"}
                  </p>
                </div>
                {!open ? 
                  <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" /> : 
                  <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />}
            </div>

            <div className={`absolute top-[40px] rounded-b transition-all z-10 ${!open ? 'hidden': 'flex flex-col bg-[#313134] w-[120px]' }`}>
                {supportedNetworks.map((network, index) => {
                    return (
                        <div className="flex items-center" key={`trending${index}`}>
                            <button
                                className={`group flex w-full items-center p-[5px] justify-start hover:bg-[#151924] `}
                                    onClick={() => setChainId(network.id)}
                                >
                              <img src={network.image} className="w-[22px] h-[22px]"/>
                              <div className="flex flex-col justify-start pl-[9px]">
                                <p className="text-[10px] leading-[12px] font-[700] text-white">{network.name}</p>
                              </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
   ) : <></>
  );
};

  // <div className="h-[34px] w-[95px] flex flex-row items-center justify-center rounded-[6px] bg-[#191d24] max-[480px]:w-full">
  //   <button
  //     onClick={() => {
  //       setOpen(!open);
  //     }}
  //     className="flex w-full justify-between pl-[7px] pt-[6px] pb-[6px] pr-[4px] "
  //   >
  //     <div className="flex items-center inline-flex w-full items-center justify-between whitespace-nowrap rounded-[123px] bg-[#18181B] border-[0.5px] border-solid border-[#49494B] py-[5px] pl-2.5 pr-2.5 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:pr-3 text-white">
  //       <img src={logo} />
  //       <p className="pl-0.5 pr-1">{trendingName}</p>
  //       {!open ? 
  //           <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" /> : 
  //           <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />}
  //     </div>
  //     <div className="flex items-center gap-[8px]">
  //       <CircleSVG size="22px"/>
  //       <div className="flex flex-col flex-start max-[480px]:flex-row max-[480px]:gap-[12px] items-start">
  //         <p className="text-[8px] leading-[9px] font-[700] max-[480px]:text-[12px] max-[480px]:leading-[14px]">BNB</p>
  //         <p className="text-[8px] leading-[9px] font-[700] max-[480px]:text-[12px] max-[480px]:leading-[14px]">$335.6</p>
  //       </div>
  //     </div>
  //     {ChevronDownSVG}
  //   </button>
  // </div>

export default CurrencySelectButton;
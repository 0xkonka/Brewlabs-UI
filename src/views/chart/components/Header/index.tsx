import { DeployerSVG, InfoSVG, NFTSVG, SwapSVG, SwitchSVG } from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import { useContext, useEffect, useState } from "react";
import { NETWORKS } from "config/constants/networks";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { getChainLogo } from "utils/functions";
import { SearchInput } from "./SearchInput";
import TrendingList from "./TrendingList";
import { tokens } from "config/constants/tokens";
import { useWeb3React } from "contexts/wagmi";
import useTokenMarketChart from "@hooks/useTokenMarketChart";
import { useDexPrice } from "@hooks/useTokenPrice";
import { DEX_GURU_WETH_ADDR } from "config/constants";

export default function Header({ selectedCurrency, setSelectedCurrency }) {
  const { chainId } = useWeb3React();
  const networks = [NETWORKS[1], NETWORKS[56]];
  const trendings = [
    { logo: "/images/chart/trending/cmc.png", name: "CMC Trending" },
    { logo: "/images/chart/trending/mixed.svg", name: "Mixed" },
    { logo: "/images/chart/trending/twitter.svg", name: "Twitter" },
    { logo: "/images/chart/trending/cmc.png", name: "CMC Recents" },
    { logo: "/images/chart/trending/dextools.svg", name: "Dextools" },
  ];
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const [selectedTrending, setSelectedTrending] = useState(0);

  useEffect(() => {
    if (Number(chainId) === 56) setSelectedNetwork(1);
    else setSelectedNetwork(0);
  }, [chainId]);

  const { price: ethPrice } = useDexPrice(1, DEX_GURU_WETH_ADDR);
  const { price: bnbPrice } = useDexPrice(56, DEX_GURU_WETH_ADDR);
  const price = { 1: ethPrice ?? 0, 56: bnbPrice ?? 0 };

  return (
    <div className="mt-[100px] flex flex-col items-center justify-between 2xl:flex-row">
      <div className="relative z-10 flex w-full flex-none flex-col items-center md:flex-row 2xl:flex-1">
        <div className="flex w-full items-center justify-between md:w-fit md:justify-start">
          <div className="flex items-center text-primary">
            <div className="mr-1 [&>svg]:!h-4 [&>svg]:!w-4">{DeployerSVG}</div>
            <div className="relative text-2xl">
              BrewCharts
              <div className="absolute -bottom-2.5 right-0 text-xs text-[#D9D9D9]">Beta 1.00</div>
            </div>
          </div>
          <div className="ml-4 ">
            <DropDown
              value={selectedNetwork}
              setValue={setSelectedNetwork}
              className="!w-[120px] !bg-[#29292b] !px-3 !text-white"
              bodyClassName="!bg-none !bg-[#29292b]"
              itemClassName="!px-3 !justify-start hover:!bg-[#b9b8b83d]"
              height="44px"
              rounded="4px"
              data={networks.map((network, i) => {
                return (
                  <div className="flex items-center" key={i}>
                    <img
                      src={getChainLogo(parseInt(network.chainId))}
                      alt={""}
                      className="primary-shadow h-6 w-6 rounded-full"
                    />
                    <div className="ml-2">
                      <div className="leading-none">{network.nativeCurrency.symbol}</div>
                      <div className="text-xs leading-none text-[#FFFFFFBF]">
                        ${price[parseInt(network.chainId)].toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            />
          </div>
        </div>
        <div className="flex items-center flex-1 justify-between md:w-fit w-full mt-4 md:mt-0 xsm:flex-row flex-col">
          <div className="ml-0 w-full max-w-[800px] flex-1 md:ml-4 md:w-fit">
            <SearchInput
              selectedChainId={parseInt(networks[selectedNetwork].chainId)}
              setSelectedCurrency={setSelectedCurrency}
            />
          </div>
          <div className="flex items-center text-tailwind xsm:ml-4 ml-0 xsm:mt-0 mt-4">
            <div className="mr-4 cursor-pointer transition hover:text-white  [&>svg]:!h-5 [&>svg]:!w-5">
              {SwitchSVG}
            </div>
            <div className="cursor-pointer transition hover:text-white  [&>svg]:!h-5 [&>svg]:!w-5">{NFTSVG}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

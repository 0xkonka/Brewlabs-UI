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
import { ChainId } from "@brewlabs/sdk";

export default function Header({ selectedCurrency, setSelectedCurrency, showReverse, setShowReverse }) {
  const { chainId } = useWeb3React();
  const networks = [NETWORKS[1], NETWORKS[56], NETWORKS[ChainId.POLYGON], NETWORKS[ChainId.ARBITRUM], NETWORKS[8453]];
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
  const { price: maticPrice } = useDexPrice(ChainId.POLYGON, DEX_GURU_WETH_ADDR);
  const { price: arbitrumPrice } = useDexPrice(ChainId.ARBITRUM, "0x82af49447d8a07e3bd95bd0d56f35241523fbab1");
  const { price: basePrice } = useDexPrice(8453, "0x4200000000000000000000000000000000000006");
  const price = {
    1: ethPrice ?? 0,
    56: bnbPrice ?? 0,
    [ChainId.POLYGON]: maticPrice ?? 0,
    [ChainId.ARBITRUM]: arbitrumPrice ?? 0,
    8453: basePrice ?? 0,
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between 2xl:flex-row">
      <div className="flex w-full flex-none flex-col items-center md:flex-row 2xl:flex-1">
        <div className="flex w-full items-center justify-between md:w-fit md:justify-start">
          <div className={`flex w-fit items-center text-primary ${showReverse ? "2xl:w-[280px]" : "2xl:w-[320px]"}`}>
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
              className="!w-[120px] !bg-[#29292b] !px-2 !text-white"
              bodyClassName="!bg-none !bg-[#29292b]"
              itemClassName="!px-2 !justify-start hover:!bg-[#b9b8b83d]"
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
                      <div className="text-xs font-bold">{network.nativeCurrency.symbol}</div>
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
        <div className="mt-4 flex w-full flex-1 items-center justify-between md:mt-0 md:w-fit">
          <div className="relative ml-0 flex-1 md:ml-4 md:w-fit">
            <SearchInput
              selectedChainId={parseInt(networks[selectedNetwork].chainId)}
              setSelectedCurrency={setSelectedCurrency}
            />
          </div>
          <div
            className={`ml-4 mt-4 hidden w-fit items-center justify-end text-tailwind xsm:mt-0 xsm:flex ${
              showReverse ? "2xl:w-[332px]" : "2xl:w-[292px]"
            }`}
          >
            <div
              className="mr-4 cursor-pointer transition hover:text-white  [&>svg]:!h-5 [&>svg]:!w-5"
              onClick={() => setShowReverse(!showReverse)}
            >
              {SwitchSVG}
            </div>
            <div
              className="tooltip cursor-pointer transition  hover:text-white [&>svg]:!h-5 [&>svg]:!w-5"
              data-tip="No Brewlabs NFT found."
            >
              {NFTSVG}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

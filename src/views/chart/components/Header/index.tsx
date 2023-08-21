import { ChartSquareSVG, NFTSVG, SwitchSVG } from "@components/dashboard/assets/svgs";
import { useEffect, useState } from "react";
import { NETWORKS } from "config/constants/networks";
import { SearchInput } from "./SearchInput";
import { useWeb3React } from "contexts/wagmi";
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
    <div className="relative z-10 mt-10 flex">
      <div className="flex flex-1">
        <div className="relative flex-1">
          <SearchInput setSelectedCurrency={setSelectedCurrency} />
          <a
            href={"https://t.me/MaverickBL"}
            target={"_blank"}
            className="absolute -bottom-5 right-0 cursor-pointer font-brand text-xs !text-[#FFFFFF59] hover:!text-white"
          >
            Advertise with us
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`ml-4 mt-4 hidden w-fit items-center justify-end text-tailwind xsm:mt-0 xsm:flex ${
            showReverse ? "2xl:w-[320px]" : "2xl:w-[292px]"
          }`}
        >
          <div className="mr-4 cursor-pointer  transition hover:text-white [&>svg]:!h-5 [&>svg]:!w-5">
            {ChartSquareSVG}
          </div>
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
  );
}

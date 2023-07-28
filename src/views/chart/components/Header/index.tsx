import { DeployerSVG, InfoSVG, NFTSVG, SwapSVG, SwitchSVG } from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import { useContext, useState } from "react";
import { NETWORKS } from "config/constants/networks";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { getChainLogo } from "utils/functions";
import { SearchInput } from "./SearchInput";
import TrendingList from "./TrendingList";
import { tokens } from "config/constants/tokens";

export default function Header({ selectedCurrency, setSelectedCurrency }) {
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

  return (
    <div className="mt-[100px] flex flex-col items-center justify-between 3xl:flex-row">
      <div className="flex w-full flex-none flex-col items-center md:flex-row 3xl:flex-1">
        <div className="flex w-full items-center justify-between md:w-fit md:justify-start">
          <div className="flex items-center text-primary">
            <div className="mr-1 [&>svg]:!h-4 [&>svg]:!w-4">{DeployerSVG}</div>
            <div className="relative text-2xl">
              BrewCharts
              <div className="absolute -bottom-2.5 right-0 text-xs text-[#D9D9D9]">Beta 1.00</div>
            </div>
          </div>
          <div className="ml-4">
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
                      <div className="text-xs leading-none text-[#FFFFFFBF]">$335.00</div>
                    </div>
                  </div>
                );
              })}
            />
          </div>
        </div>
        <div className="ml-0 mt-4 w-full max-w-[800px] flex-1 md:ml-4 md:mt-0 md:w-fit">
          <SearchInput
            selectedChainId={parseInt(networks[selectedNetwork].chainId)}
            setSelectedCurrency={setSelectedCurrency}
            selectedCurrency={selectedCurrency}
          />
        </div>
      </div>
      <div className="mt-10 w-full 3xl:mt-0 3xl:w-fit">
        <div className="flex w-full items-center">
          <div className="relative ml-0 md:ml-4">
            <DropDown
              value={selectedTrending}
              setValue={setSelectedTrending}
              data={trendings.map((trending, i) => (
                <div key={i} className="flex items-center text-base">
                  <img src={trending.logo} alt={""} className="mr-2 w-4" />
                  <div className="text-white">{trending.name}</div>
                </div>
              ))}
              className="!w-[180px] !bg-[#29292b] !px-4 !text-white"
              bodyClassName="!bg-none !bg-[#29292b]"
              itemClassName="!px-4 !justify-start hover:!bg-[#b9b8b83d]"
              height="44px"
              rounded="4px"
            />
            <div className="absolute -top-5 left-0 flex items-center">
              <div className="mr-1 cursor-pointer text-tailwind transition hover:text-white [&>svg]:!h-3 [&>svg]:!w-3">
                {InfoSVG}
              </div>
              <div className="whitespace-nowrap text-xs text-[#D9D9D9]">What is the trending heat map?</div>
            </div>
          </div>
          <div className="mx-4 md:block hidden">
            <TrendingList trendings={[tokens[1].brews, tokens[56].brews, tokens[1].roo]} />
          </div>
          <div className="flex items-center text-tailwind md:ml-0 ml-4">
            <div className="mr-4 cursor-pointer transition hover:text-white  [&>svg]:!h-5 [&>svg]:!w-5">
              {SwitchSVG}
            </div>
            <div className="cursor-pointer transition hover:text-white  [&>svg]:!h-5 [&>svg]:!w-5">{NFTSVG}</div>
          </div>
        </div>
        <div className="mt-4 block md:hidden">
          <TrendingList trendings={[tokens[1].brews, tokens[56].brews, tokens[1].roo]} />
        </div>
      </div>
    </div>
  );
}

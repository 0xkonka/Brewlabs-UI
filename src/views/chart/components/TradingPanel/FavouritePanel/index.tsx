import { StarIcon } from "@heroicons/react/24/solid";
import { ChartContext } from "contexts/ChartContext";
import { useContext, useEffect, useState } from "react";
import FavouriteCard from "./FavouriteCard";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { useCGListings, useCMCListings } from "@hooks/chart/useScrappingSite";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { NETWORKS } from "config/constants/networks";
import { ChainId } from "@brewlabs/sdk";
import { getChainLogo } from "utils/functions";

export default function FavouritePanel({ setSelectedCurrency }) {
  const { favourites }: any = useContext(ChartContext);

  const filters = [
    { icon: <StarIcon className="h-4 w-4" />, name: "Favourites" },
    {
      icon: <img src={"/images/chart/trending/cmc.png"} alt={""} className="h-4 w-4 rounded-full" />,
      name: <div className="text-white">CMC Trendings</div>,
    },
    {
      icon: <img src={"/images/chart/trending/cmc.png"} alt={""} className="h-4 w-4 rounded-full" />,
      name: <div className="text-white">CMC Recently Added</div>,
    },
    {
      icon: <img src={"/images/chart/trending/cg.png"} alt={""} className="h-4 w-4 rounded-full" />,
      name: <div className="text-white">CG Trendings</div>,
    },
  ];
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(0);

  const { trendings, newListings }: any = useCMCListings();
  const { trendings: cgTrendings }: any = useCGListings();
  const { chainId } = useActiveChainId();

  const arrays = [favourites, trendings, newListings, cgTrendings];
  const networks = [
    NETWORKS[ChainId.ETHEREUM],
    NETWORKS[ChainId.BSC_MAINNET],
    NETWORKS[ChainId.POLYGON],
    NETWORKS[ChainId.ARBITRUM],
    NETWORKS[8453],
  ];

  useEffect(() => {
    if (Number(chainId) === 56) setSelectedNetwork(1);
    else setSelectedNetwork(0);
  }, [chainId]);

  return (
    <>
      <div className="flex h-[660px] w-[calc(100%+24px)] flex-col">
        <div className="flex items-center justify-between pr-5">
          <DropDown
            value={selectedFilter}
            setValue={setSelectedFilter}
            data={filters.map((filter, i) => (
              <div className="flex items-center text-primary" key={i}>
                <div>{filter.icon}</div>
                <div className=" ml-1 text-sm">{filter.name}</div>
              </div>
            ))}
            height={"40px"}
            rounded={"6px"}
            className="!w-[188px] !bg-[#202023] !text-xs !text-[#ffffff58]"
            bodyClassName="!bg-none !bg-[#202023]"
            itemClassName={`hover:!bg-[#29292b] !justify-start !px-2`}
            isBorder={true}
          />

          <DropDown
            value={selectedNetwork}
            setValue={setSelectedNetwork}
            data={networks.map((network, i) => (
              <img
                key={i}
                src={getChainLogo(parseInt(network.chainId))}
                alt={""}
                className="primary-shadow h-6 w-6 rounded-full"
              />
            ))}
            height={"40px"}
            rounded={"6px"}
            className="!w-16 !bg-[#202023] !text-xs !text-[#ffffff58]"
            bodyClassName="!bg-none !bg-[#202023]"
            itemClassName={`hover:!bg-[#29292b] !justify-start !px-2`}
            isBorder={true}
          />
        </div>
        <div className="yellowScroll -ml-3 mt-3 w-[calc(100%+24px)] flex-1 overflow-x-clip overflow-y-scroll pl-3 pr-5 pt-2">
          {arrays[selectedFilter]
            .filter((data) => Number(data.chainId) === parseInt(networks[selectedNetwork].chainId))
            .map((favourite, i) => {
              return (
                <FavouriteCard
                  key={i}
                  pair={favourite}
                  setSelectedCurrency={setSelectedCurrency}
                  type={selectedFilter}
                />
              );
            })}
        </div>
      </div>
      <div className={`mb-4 mt-4 hidden h-[120px] rounded-lg  bg-[url('/images/directory/truenft.png')] 2xl:block`} />
    </>
  );
}

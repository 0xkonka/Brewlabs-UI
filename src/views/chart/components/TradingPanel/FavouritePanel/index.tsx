import { StarIcon } from "@heroicons/react/24/solid";
import { ChartContext } from "contexts/ChartContext";
import { useContext, useState } from "react";
import FavouriteCard from "./FavouriteCard";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";

export default function FavouritePanel({ setSelectedCurrency }) {
  const { favourites }: any = useContext(ChartContext);

  const filters = [
    <div className="flex items-center text-primary" key={0}>
      <div>
        <StarIcon className="h-4 w-4" />
      </div>
      <div className=" ml-1 text-sm">Favourites</div>
    </div>,
    // <div className="flex items-center text-[#FFFFFF80]" key={0}>
    //   <div>
    //     <img src={"/images/chart/trending/cmc.png"} alt={""} className="h-4 w-4 rounded-full" />
    //   </div>
    //   <div className=" ml-1 text-sm">CMC Trendings</div>
    // </div>,
    // <div className="flex items-center text-[#FFFFFF80]" key={0}>
    //   <div>
    //     <img src={"/images/chart/trending/cmc.png"} alt={""} className="h-4 w-4 rounded-full" />
    //   </div>
    //   <div className=" ml-1 text-sm">CMC Recently Added</div>
    // </div>,
  ];
  const [selectedFilter, setSelectedFilter] = useState(0);

  return (
    <>
      <div className="flex h-[660px] w-[calc(100%+24px)] flex-col">
        <DropDown
          value={selectedFilter}
          setValue={setSelectedFilter}
          data={filters}
          height={"40px"}
          rounded={"6px"}
          className="!w-[200px] !bg-[#202023] !text-xs !text-[#FFFFB2]"
          bodyClassName="!bg-none !bg-[#202023]"
          itemClassName="hover:!bg-[#29292b] !justify-start !px-2"
        />
        <div className="yellowScroll -ml-3 mt-3 w-[calc(100%+24px)] flex-1 overflow-x-clip overflow-y-scroll pl-3 pr-5 pt-2">
          {favourites.map((favourite, i) => {
            return <FavouriteCard key={i} pair={favourite} setSelectedCurrency={setSelectedCurrency} />;
          })}
        </div>
      </div>
      <div className={`mb-4 mt-4 hidden h-[120px] rounded-lg  bg-[url('/images/directory/truenft.png')] 2xl:block`} />
    </>
  );
}

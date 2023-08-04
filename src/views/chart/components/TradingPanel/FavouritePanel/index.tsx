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
    <div className="flex h-[660px] w-full flex-col">
      <DropDown
        value={selectedFilter}
        setValue={setSelectedFilter}
        data={filters}
        height={"40px"}
        rounded={"6px"}
        className="!w-[200px] !bg-[#202023] !text-xs !text-tailwind"
        bodyClassName="!bg-none !bg-[#202023]"
        itemClassName="hover:!bg-[#29292b] !justify-start !px-2"
      />
      <div className="yellowScroll mt-3 flex-1 overflow-x-clip overflow-y-scroll pr-2 pt-2">
        {favourites.map((favourite, i) => {
          return <FavouriteCard key={i} pair={favourite} setSelectedCurrency={setSelectedCurrency} />;
        })}
      </div>
    </div>
  );
}

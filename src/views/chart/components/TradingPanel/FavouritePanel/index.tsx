import { OpenWalletSVG } from "@components/dashboard/assets/svgs";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";
import FavouriteCard from "./FavouriteCard";

export default function FavouritePanel() {
  const { favourites, onFavourites }: any = useContext(ChartContext);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary">
          <div>
            <StarIcon className="h-4 w-4" />
          </div>
          <div className=" ml-1 text-sm">Favourites</div>
        </div>
        <div className="primary-shadow flex cursor-pointer items-center rounded-md bg-[#B9B8B80D]  p-[6px_10px] text-primary ">
          <div className="mr-1 text-sm leading-none">Open wallet</div>
          <div>{OpenWalletSVG}</div>
        </div>
      </div>
      <div className="mt-7">
        {favourites.map((favourite, i) => {
          return <FavouriteCard key={i} pair={favourite} />;
        })}
      </div>
    </div>
  );
}

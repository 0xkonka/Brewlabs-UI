import { WalletSVG } from "@components/dashboard/assets/svgs";
import { StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function FavouritePanel() {
  return (
    <div className="w-[280px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary">
          <div>
            <StarIcon className="h-4 w-4" />
          </div>
          <div className=" ml-1 text-sm">Favourites</div>
        </div>
        <div className="primary-shadow flex cursor-pointer items-center rounded-md bg-[#B9B8B80D]  p-1.5 text-primary ">
          <div className="mr-1 text-sm leading-none">Open wallet</div>
          <div>{WalletSVG}</div>
        </div>
      </div>
    </div>
  );
}

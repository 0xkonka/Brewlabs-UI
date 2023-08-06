import { CloseCircle } from "@components/dashboard/assets/svgs";
import { useContext, useState } from "react";
import { isAddress } from "utils";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { usePairDexInfo } from "../../TokenInfo/hooks/usePairInfo";
import { ChartContext } from "contexts/ChartContext";
import TokenLogo from "@components/logo/TokenLogo";

export default function FavouriteCard({ pair, setSelectedCurrency }) {
  const [isFade, setIsFade] = useState(false);
  const { info }: any = usePairDexInfo(pair.tokenAddresses[0], pair.chainId);

  const { onFavourites }: any = useContext(ChartContext);

  return (
    <div
      className={`${
        isFade ? "opacity-0 duration-300" : ""
      } primary-shadow relative mb-3 flex cursor-pointer items-center justify-between rounded-md bg-[#B9B8B80D] p-3.5 transition-all hover:scale-[1.05] hover:bg-[#B9B8B822]`}
      onClick={() => setSelectedCurrency(pair)}
    >
      <div className="flex items-center">
        <TokenLogo
          src={getTokenLogoURL(isAddress(pair.tokenAddresses[0]), pair.chainId)}
          alt={""}
          classNames="h-4 w-4 rounded-full"
        />
        <div className="mx-2 flex-1 overflow-hidden text-ellipsis text-sm text-white">{pair.symbols[0]}</div>
        <div className="text-xs text-[#FFFFFF80]">{pair.symbols[1]}</div>
      </div>
      <div className="flex items-center text-sm">
        <div className={`mx-2 text-xs ${info?.priceChange >= 0 ? "text-green" : "text-danger"}`}>
          {info?.priceChange >= 0 ? "+" : ""}
          {info?.priceChange.toFixed(2)}%
        </div>
        <div className="text-white">${info ? info.price.toFixed(3) : "0.000"}</div>
      </div>
      <button
        className="absolute -right-2 -top-2 [&>svg]:!h-5 [&>svg]:!w-5"
        onClick={() => {
          setIsFade(true);
          setTimeout(() => {
            setIsFade(false);
            onFavourites(pair, 2);
          }, 300);
          //   { chainId, address: _address, tokenAddress, symbol1 }
        }}
      >
        {CloseCircle}
      </button>
    </div>
  );
}

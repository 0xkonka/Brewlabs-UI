import { CloseCircle } from "@components/dashboard/assets/svgs";
import { useContext, useState } from "react";
import { isAddress } from "utils";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { usePairDexInfo } from "../../TokenInfo/hooks/usePairInfo";
import { ChartContext } from "contexts/ChartContext";

export default function FavouriteCard({ pair, setSelectedCurrency }) {
  const [isFade, setIsFade] = useState(false);
  const { info }: any = usePairDexInfo(pair.tokenAddress, pair.chainId);

  const { onFavourites }: any = useContext(ChartContext);

  return (
    <div
      className={`${isFade ? "opacity-0 transition-all duration-300" : ""
        } primary-shadow relative mb-3 flex items-center justify-between rounded-md bg-[#B9B8B80D] p-3.5 cursor-pointer hover:bg-[#B9B8B822]`}
    // onClick={() => setSelectedCurrency({
    //   tokenAddresses: ["0xdad33e12e61dc2f2692f2c12e6303b5ade7277ba", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    //   symbols: ["BREWLABS", "WETH"],
    //   chainId: pair.chainId,
    //   address: pair.address,
    //   verified: true,
    //   swap: "uniswap",
    // })}
    >
      <div className="flex items-center">
        <img
          src={getTokenLogoURL(isAddress(pair.tokenAddress), pair.chainId)}
          alt={""}
          className="h-4 w-4 rounded-full"
        />
        <div className="mx-2 flex-1 overflow-hidden text-ellipsis text-sm text-white">{info?.symbol}</div>
        <div className="text-xs text-[#FFFFFF80]">{pair.symbol1}</div>
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
            onFavourites(pair.address, pair.chainId, pair.tokenAddress, pair.symbol1, 2);
          }, 300);
          //   { chainId, address: _address, tokenAddress, symbol1 }
        }}
      >
        {CloseCircle}
      </button>
    </div>
  );
}

import { CloseCircle } from "@components/dashboard/assets/svgs";
import { useContext, useEffect, useRef, useState } from "react";
import { isAddress } from "utils";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { usePairDexInfo } from "../../TokenInfo/hooks/usePairInfo";
import { ChartContext } from "contexts/ChartContext";
import TokenLogo from "@components/logo/TokenLogo";
import { fetchAllPairs } from "@hooks/useTokenAllPairs";
import { SkeletonComponent } from "@components/SkeletonComponent";

export default function FavouriteCard({ pair, setSelectedCurrency, type }) {
  const [isFade, setIsFade] = useState(false);
  const [fpair, setFPair] = useState(null);
  useEffect(() => {
    if (type === 0) return;
    fetchAllPairs(pair, 1, "volume24h_stable")
      .then((result) => setFPair(result ? result[0] : null))
      .catch((e) => console.log(e));
  }, [type]);

  const { info }: any = usePairDexInfo(
    type === 0 ? pair.tokenAddresses[0] : fpair?.tokenAddresses[0],
    type === 0 ? pair.chainId : fpair?.chainId
  );

  const { onFavourites }: any = useContext(ChartContext);

  const wrappedPair = type === 0 ? pair : fpair;

  const closeRef: any = useRef();

  return wrappedPair ? (
    <div
      className={`${
        isFade ? "opacity-0" : ""
      } primary-shadow relative mb-3 flex cursor-pointer items-center justify-between rounded-md bg-[#B9B8B80D]  p-3.5 transition-all duration-300 hover:scale-[1.05] hover:bg-[#B9B8B822]`}
      onClick={(e) => !closeRef.current.contains(e.target) && wrappedPair && setSelectedCurrency(wrappedPair)}
    >
      <div className="flex items-center">
        <TokenLogo
          src={getTokenLogoURL(isAddress(wrappedPair?.tokenAddresses[0]), wrappedPair?.chainId)}
          alt={""}
          classNames="h-4 w-4 rounded-full"
        />
        <div className="mx-2 flex-1 overflow-hidden text-ellipsis text-sm text-white">{wrappedPair?.symbols[0]}</div>
        <div className="text-xs text-[#FFFFFF80]">{wrappedPair?.symbols[1]}</div>
      </div>
      <div className="flex items-center text-sm">
        <div className={`mx-2 text-xs ${info?.priceChange >= 0 ? "text-green" : "text-danger"}`}>
          {info?.priceChange >= 0 ? "+" : ""}
          {info?.priceChange.toFixed(2)}%
        </div>
        <div className="text-white">${info ? info.price.toFixed(3) : "0.000"}</div>
      </div>
      {type === 0 ? (
        <button
          className="absolute -right-2 -top-2 [&>svg]:!h-5 [&>svg]:!w-5"
          onClick={() => {
            setIsFade(true);
            setTimeout(() => {
              setIsFade(false);
              onFavourites(wrappedPair, 2);
            }, 300);
            //   { chainId, address: _address, tokenAddress, symbol1 }
          }}
          ref={closeRef}
        >
          {CloseCircle}
        </button>
      ) : (
        ""
      )}
    </div>
  ) : (
    <div />
  );
}

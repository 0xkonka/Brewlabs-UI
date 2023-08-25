import { useContext } from "react";

import { useTokenAllPairs } from "@hooks/useTokenAllPairs";
import { getChainLogo, getDexLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import TokenLogo from "@components/logo/TokenLogo";
import { ChartContext } from "contexts/ChartContext";
import { useRouter } from "next/router";
import { DEX_GURU_CHAIN_NAME } from "config";

export const PairItem = ({ pair, isLast, setCriteria }) => {
  const router = useRouter();

  return (
    <div
      className="flex h-[44px] cursor-pointer items-center overflow-hidden text-ellipsis px-3 transition hover:bg-[#5b5b5c]"
      onClick={() => {
        router.push(`/chart/${DEX_GURU_CHAIN_NAME[pair.chainId]}/${pair.address}`);
        setCriteria("");
      }}
    >
      <div className="relative">
        <img src={getChainLogo(pair.chainId)} alt={""} className="primary-shadow h-6 w-6 rounded-full" />
        <img
          src={getDexLogo(pair.swap)}
          alt={""}
          className="primary-shadow absolute -right-1 -top-1 h-4 w-4 rounded-full"
        />
      </div>
      <div
        className={`mx-2 flex flex-1 items-center justify-between ${
          !isLast ? "border-b border-dotted border-[#D9D9D980]" : ""
        } h-full overflow-hidden text-ellipsis text-sm leading-none`}
      >
        <div className="flex-1 overflow-hidden text-ellipsis text-[#FFFFFFBF]">
          <div>
            <span className="text-white">{pair.symbols[0]}</span> ({pair.symbols[1]})
          </div>
          <div className="overflow-hidden text-ellipsis text-xs">{pair.address}</div>
        </div>
        <div className="text-right">
          <div>
            {pair.symbols[0]} <span className="text-white">${(pair.price ?? 0).toFixed(3)}</span>
          </div>
          <div className={`text-xs ${pair.priceChange24h >= 0 ? "text-green" : "text-danger"}`}>
            ({pair.priceChange24h >= 0 ? "+" : ""}
            {(pair.priceChange24h ?? 0).toFixed(2)}%)
          </div>
        </div>
      </div>
      <TokenLogo
        src={getTokenLogoURL(isAddress(pair.tokenAddresses[0]), pair.chainId)}
        classNames="primary-shadow h-6 w-6 rounded-full"
      />
    </div>
  );
};

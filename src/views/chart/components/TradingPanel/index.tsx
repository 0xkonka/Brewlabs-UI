import TradingViewChart from "./TradingViewChart";
import FavouritePanel from "./FavouritePanel";
import SwapHistory from "./SwapHistory";
import SwapOption from "./SwapOption";
import UserInfo from "./UserInfo";
import { useEffect, useState } from "react";
import { defaultVolume, fetchTradingHistories, getVolumeDatas } from "@hooks/useTokenAllPairs";
import { useSecondRefreshEffect } from "@hooks/useRefreshEffect";
import { isAddress } from "utils";
import { DEX_GURU_CHAIN_NAME } from "config";

let wrappedQuery;

export default function TradingPanel({ currency, marketInfos, setSelectedCurrency, showReverse }) {
  const [volumeDatas, setVolumeDatas] = useState(defaultVolume);

  const getQuery = () => {
    const query: any = {
      address: currency.tokenAddresses[0],
      current_token_id: `${currency.tokenAddresses[0]}-${DEX_GURU_CHAIN_NAME[currency.chainId]}`,
      chainId: currency.chainId,
      pool_address: currency.address,
      amm: currency.swap,
      date: { start_date: Date.now() - 3600 * 24 * 7 * 1000, end_date: Date.now() },
      limit: 0,
      offset: 0,
      with_full_totals: true,
      order: "desc",
      token_status: "all",
      transaction_types: ["swap"],
      sort_by: "timestamp",
    };
    return query;
  };

  useEffect(() => {
    const query: any = getQuery();
    if (!isAddress(query.address)) {
      return;
    }
    wrappedQuery = JSON.stringify(query);
    fetchTradingHistories(query, currency.chainId)
      .then((result) => {
        if (wrappedQuery === JSON.stringify(query)) {
          const volumeDatas = getVolumeDatas(currency.tokenAddresses[0], result);
          setVolumeDatas(volumeDatas);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currency.address]);

  return (
    <div className="mt-6">
      <div className={`flex ${showReverse ? "flex-row-reverse" : ""}`}>
        <div className="hidden w-[320px] 2xl:block">
          <SwapOption currency={currency} marketInfos={marketInfos} volumeDatas={volumeDatas} />
        </div>
        <div className="mx-0 flex-1 2xl:mx-4">
          <div className="h-[660px]">
            <TradingViewChart currency={currency} />
          </div>
          <SwapHistory currency={currency} />
        </div>
        <div className="hidden w-[280px] 2xl:block">
          <FavouritePanel setSelectedCurrency={setSelectedCurrency} />
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between sm:items-start xl:flex-row 2xl:hidden">
        <div className="mr-0 flex-1 xl:mr-4">
          <SwapOption currency={currency} marketInfos={marketInfos} volumeDatas={volumeDatas} />
        </div>
        <div className="mt-6 w-full max-w-[300px] xl:mt-0">
          <FavouritePanel setSelectedCurrency={setSelectedCurrency} />
        </div>
      </div>
    </div>
  );
}

import SwapOption from "./SwapOption";
import { useEffect, useState } from "react";
import { defaultVolume, fetchTradingHistories, getVolumeDatas } from "@hooks/useTokenAllPairs";
import { isAddress } from "utils";
import { DEX_GURU_CHAIN_NAME } from "config";
import { getBaseInfos } from "@hooks/useTokenInfo";
import { useAccount } from "wagmi";
import { getBalances } from "@hooks/useTokenMultiChainBalance";
import { fetchDexGuruPrice } from "@hooks/useTokenPrice";
import FavouritePanel from "./FavouritePanel";
import SwapHistory from "./SwapHistory";
import TradingViewChart from "./TradingViewChart";
import { useMediaQuery } from "react-responsive";

let wrappedQuery;

export default function TradingPanel({ currency, marketInfos, showReverse }) {
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

  const stringifiedCurrency = JSON.stringify(currency && Object.keys(currency).filter((key) => key !== "params"));

  useEffect(() => {
    if (!currency) return;
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
  }, [stringifiedCurrency]);

  const [balances, setBalances] = useState({});
  const [price, setPrice] = useState(0);
  const [lpPrice, setLPPrice] = useState(0);

  useEffect(() => {
    if (!currency) return;

    Promise.all([
      fetchDexGuruPrice(currency.chainId, currency.tokenAddresses[0]),
      fetchDexGuruPrice[(currency.chainId, currency.address)],
    ])
      .then((result) => {
        setPrice(result[0]);
        setLPPrice(result[1]);
      })
      .catch((e) => console.log(e));
  }, [stringifiedCurrency]);

  const { address: account } = useAccount();

  useEffect(() => {
    if (!currency || !currency.decimals) return;
    getBalances(
      {
        [currency.chainId]: [
          { address: currency.tokenAddresses[0], decimals: currency.decimals[0] },
          { address: currency.address, decimals: 18 },
        ],
      },
      { [currency.chainId]: [account, account] }
    )
      .then((result) => setBalances(result.balances))
      .catch((e) => console.log(e));
  }, [stringifiedCurrency, account]);

  const w2xl = useMediaQuery({ query: "(min-width: 1536px)" });

  return (
    <div className="mt-6">
      <div className={`flex ${showReverse ? "flex-row-reverse" : ""}`}>
        <div className="hidden w-[320px] 2xl:block">
          <SwapOption
            currency={currency}
            marketInfos={marketInfos}
            volumeDatas={volumeDatas}
            balances={balances}
            price={price}
            lpPrice={lpPrice}
          />
        </div>
        <div className="mx-0 flex-1 2xl:mx-4">
          <div className="h-[660px]">
            <TradingViewChart currency={currency} />
          </div>
          {currency ? <SwapHistory currency={currency} /> : ""}
        </div>
        {w2xl ? (
          <div className="w-[280px]">
            <FavouritePanel />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between sm:items-start xl:flex-row 2xl:hidden">
        <div className="mr-0 flex-1 xl:mr-4">
          <SwapOption
            currency={currency}
            marketInfos={marketInfos}
            volumeDatas={volumeDatas}
            balances={balances}
            price={price}
            lpPrice={lpPrice}
          />
        </div>
        {!w2xl ? (
          <div className="mt-6 w-full max-w-[300px] xl:mt-0">
            <FavouritePanel />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

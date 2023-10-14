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

export default function TradingPanel({ selectedPair, showReverse, marketInfos }) {
  const [volumeDatas, setVolumeDatas] = useState(defaultVolume);

  const getQuery = () => {
    const query: any = {
      address: selectedPair.baseToken.address,
      current_token_id: `${selectedPair.baseToken.address}-${DEX_GURU_CHAIN_NAME[selectedPair.chainId]}`,
      chainId: selectedPair.chainId,
      pool_address: selectedPair.address,
      amm: selectedPair.dexId,
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

  const stringifiedCurrency = JSON.stringify(
    selectedPair && Object.keys(selectedPair).filter((key) => key !== "params")
  );

  useEffect(() => {
    if (!selectedPair) return;
    const query: any = getQuery();
    if (!isAddress(query.address)) {
      return;
    }
    wrappedQuery = JSON.stringify(query);
    fetchTradingHistories(query, selectedPair.chainId)
      .then((result) => {
        if (wrappedQuery === JSON.stringify(query)) {
          const volumeDatas = getVolumeDatas(selectedPair.baseToken.address, result);
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
    if (!selectedPair) return;

    Promise.all([
      fetchDexGuruPrice(selectedPair.chainId, selectedPair.baseToken.address),
      fetchDexGuruPrice[(selectedPair.chainId, selectedPair.address)],
    ])
      .then((result) => {
        setPrice(result[0]);
        setLPPrice(result[1]);
      })
      .catch((e) => console.log(e));
  }, [stringifiedCurrency]);

  const { address: account } = useAccount();

  useEffect(() => {
    if (!selectedPair) return;
    getBalances(
      {
        [selectedPair.chainId]: [
          { address: selectedPair.baseToken.address, decimals: selectedPair.baseToken.decimals },
          { address: selectedPair.address, decimals: 18 },
        ],
      },
      { [selectedPair.chainId]: [account, account] }
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
            selectedPair={selectedPair}
            marketInfos={marketInfos}
            volumeDatas={volumeDatas}
            balances={balances}
            price={price}
            lpPrice={lpPrice}
          />
        </div>
        <div className="mx-0 flex-1 2xl:mx-4">
          <div className="h-[660px]">
            <TradingViewChart selectedPair={selectedPair} />
          </div>
          {selectedPair ? <SwapHistory selectedPair={selectedPair} /> : ""}
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
            selectedPair={selectedPair}
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

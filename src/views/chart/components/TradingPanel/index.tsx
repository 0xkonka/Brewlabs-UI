import SwapOption from "./SwapOption";
import { useEffect, useState } from "react";
import { defaultVolume, fetchTradingHistoriesByDexScreener, getVolumeDatas } from "@hooks/useTokenAllPairs";
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
  const [volumeDataLoading, setVolumeDataLoading] = useState(false);

  const stringifiedPair = JSON.stringify(selectedPair);

  useEffect(() => {
    if (!selectedPair) return;
    const query: any = {
      pair: selectedPair.address,
      quote: selectedPair.quoteToken.address,
      a: selectedPair.a,
      type: "buyOrSell",
    };
    if (!isAddress(query.pair)) {
      return;
    }
    wrappedQuery = JSON.stringify(query);
    setVolumeDataLoading(true);
    fetchTradingHistoriesByDexScreener(query, selectedPair.chainId, "all", Date.now() - 86400000 * 7)
      .then((result) => {
        if (wrappedQuery === JSON.stringify(query)) {
          const volumeDatas = getVolumeDatas(result);
          setVolumeDatas(volumeDatas);
        }
        setVolumeDataLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setVolumeDataLoading(false);
      });
  }, [stringifiedPair]);

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
  }, [stringifiedPair]);

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
  }, [stringifiedPair, account]);

  const w2xl = useMediaQuery({ query: "(min-width: 1536px)" });
  return (
    <div className="mt-6">
      <div className={`flex ${showReverse ? "flex-row-reverse" : ""}`}>
        <div className="hidden w-[320px] 2xl:block">
          <SwapOption
            selectedPair={selectedPair}
            marketInfos={marketInfos}
            volumeDatas={volumeDatas}
            volumeDataLoading={volumeDataLoading}
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
            volumeDataLoading={volumeDataLoading}
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

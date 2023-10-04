import { useEffect, useState } from "react";
import HistoryToolBar from "./HistoryToolBar";
import HistoryList from "./HistoryList";
import { useAccount } from "wagmi";
import UserInfo from "../UserInfo";
import { isAddress } from "utils";
import { DEX_GURU_CHAIN_NAME } from "config";
import { fetchTradingHistoriesByDexScreener } from "@hooks/useTokenAllPairs";
import { useFastRefreshEffect, useSecondRefreshEffect } from "@hooks/useRefreshEffect";

let wrappedQuery;
export default function SwapHistory({ currency }) {
  const { address: account } = useAccount();
  const [showType, setShowType] = useState(0);
  const [criteria, setCriteria] = useState("");
  const [tb, setTB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [totalHistories, setTotalHistories] = useState([]);
  const [recentHistories, setRecentHistories] = useState([]);

  const getQuery = () => {
    let query: any = {
      pair: currency.address,
      quote: currency.tokenAddresses[1],
      tb,
    };
    switch (showType) {
      case 0:
        return { ...query, type: "buyOrSell" };
      case 1:
        return { ...query, type: "buy" };
      case 2:
        return { ...query, type: "sell" };
      case 3:
        return {
          ...query,
          account: account ? account.toLowerCase() : "0x0",
          type: "buyOrSell",
        };
      case 4:
        return {
          ...query,
          account: account ? account.toLowerCase() : "0x0",
          type: "buy",
        };
      case 5:
        return {
          ...query,
          account: account ? account.toLowerCase() : "0x0",
          type: "sell",
        };
      case 6:
        return {
          ...query,
          account: criteria ? criteria.toLowerCase() : "0x0",
          type: "buyOrSell",
          pool: currency.address,
        };
    }
  };

  const stringifiedValue = JSON.stringify({ showType, address: currency.address, tb, criteria });

  useEffect(() => {
    const query: any = getQuery();
    if (!isAddress(query.pair)) {
      return;
    }
    setLoading(true);
    setHistories([]);
    wrappedQuery = JSON.stringify(query);
    fetchTradingHistoriesByDexScreener(query, currency.chainId)
      .then((result) => {
        if (wrappedQuery === JSON.stringify(query)) {
          setHistories(result);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [stringifiedValue]);

  useEffect(() => {
    setTotalHistories([]);
    setTB(0);
  }, [showType, currency.address, criteria]);

  useFastRefreshEffect(() => {
    let query = getQuery();
    query.tb = 0;

    fetchTradingHistoriesByDexScreener(query, currency.chainId)
      .then((result) => {
        if (wrappedQuery === JSON.stringify(query)) setRecentHistories(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [stringifiedValue]);

  const strigifiedHistories = JSON.stringify(histories);
  const strigifiedRecentHistories = JSON.stringify(recentHistories);

  useEffect(() => {
    const total = [...histories];
    let temp = [...totalHistories];
    for (let i = 0; i < total.length; i++) {
      const isExisting = temp.find((history) => JSON.stringify(history) === JSON.stringify(total[i]));
      if (!isExisting) {
        temp.push(total[i]);
      }
    }
    setTotalHistories(temp.sort((a, b) => b.timestamp - a.timestamp));
  }, [strigifiedHistories]);

  useEffect(() => {
    const total = [...recentHistories];
    let temp = [...totalHistories];
    for (let i = 0; i < total.length; i++) {
      const isExisting = temp.find((history) => JSON.stringify(history) === JSON.stringify(total[i]));
      if (!isExisting) {
        temp.push(total[i]);
      }
    }
    setTotalHistories(temp.sort((a, b) => b.timestamp - a.timestamp));
  }, [strigifiedRecentHistories]);

  return (
    <div className="duraton-300 transition-all">
      <HistoryToolBar showType={showType} setShowType={setShowType} criteria={criteria} setCriteria={setCriteria} />
      <UserInfo
        currency={currency}
        active={showType >= 3}
        account={showType === 6 ? criteria : account}
        setShowType={setShowType}
        setCriteria={setCriteria}
      />
      <HistoryList
        histories={totalHistories}
        currency={currency}
        loading={loading}
        tb={tb}
        setTB={setTB}
        setCriteria={setCriteria}
        setShowType={setShowType}
        isAccount={showType === 6}
      />
    </div>
  );
}

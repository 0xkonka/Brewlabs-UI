import { useEffect, useState } from "react";
import HistoryToolBar from "./HistoryToolBar";
import HistoryList from "./HistoryList";
import { useAccount } from "wagmi";
import UserInfo from "../UserInfo";
import { isAddress } from "utils";
import { DEX_GURU_CHAIN_NAME } from "config";
import { fetchTradingHistories } from "@hooks/useTokenAllPairs";
import { useSecondRefreshEffect } from "@hooks/useRefreshEffect";

let wrappedQuery;
export default function SwapHistory({ currency }) {
  // const { address: account } = useAccount();
  const account = "0x61d8F1baE35A2F71E6868023F16c88E8d9e6200f";
  const [showType, setShowType] = useState(0);
  const [criteria, setCriteria] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [totalHistories, setTotalHistories] = useState([]);
  const [recentHistories, setRecentHistories] = useState([]);

  const getQuery = () => {
    let query: any = {
      address: currency.tokenAddresses[0],
      current_token_id: `${currency.tokenAddresses[0]}-${DEX_GURU_CHAIN_NAME[currency.chainId]}`,
      chainId: currency.chainId,
      amm: currency.swap,
      period: 0,
      limit: 100,
      offset: offset * 100,
      with_full_totals: true,
      order: "desc",
      token_status: "all",
      sort_by: "timestamp",
    };
    switch (showType) {
      case 0:
        return { ...query, pool_address: currency.address, transaction_types: ["swap"] };
      case 1:
        query = { ...query, token_status: "buy", pool_address: currency.address, transaction_types: ["swap"] };
        return query;
      case 2:
        query = { ...query, token_status: "sell", pool_address: currency.address, transaction_types: ["swap"] };
        return query;
      case 3:
        query = {
          ...query,
          account: account ? account.toLowerCase() : "0x0",
          type: "all",
          pool: currency.address,
        };
        return query;
      case 4:
        query = {
          ...query,
          account: account ? account.toLowerCase() : "0x0",
          type: "buy",
          pool: currency.address,
        };
        return query;
      case 5:
        query = {
          ...query,
          account: account ? account.toLowerCase() : "0x0",
          type: "sell",
          pool: currency.address,
        };
        return query;
      case 6:
        query = {
          ...query,
          account: criteria ? criteria.toLowerCase() : "0x0",
          type: "all",
          pool: currency.address,
        };
        return query;
    }
  };

  useEffect(() => {
    const query: any = getQuery();
    if (!isAddress(query.address)) {
      return;
    }
    setLoading(true);
    setHistories([]);
    wrappedQuery = JSON.stringify(query);
    fetchTradingHistories(query, currency.chainId)
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
  }, [showType, currency.address, offset, criteria]);

  useEffect(() => {
    setTotalHistories([]);
    setOffset(0);
  }, [showType, currency.address, criteria]);

  useSecondRefreshEffect(() => {
    let query = getQuery();
    query.offset = 0;

    fetchTradingHistories(query, currency.chainId)
      .then((result) => {
        if (wrappedQuery === JSON.stringify(query)) setRecentHistories(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [showType, currency.address, offset, criteria]);

  const strigifiedHistories = JSON.stringify(histories);
  const strigifiedRecentHistories = JSON.stringify(recentHistories);

  useEffect(() => {
    const total = [...histories];
    let temp = [...totalHistories];
    for (let i = 0; i < total.length; i++) {
      const isExisting = temp.find((history) => JSON.stringify(history) === JSON.stringify(total[i]));
      if (!isExisting && total[i].poolAddress === currency.address.toLowerCase()) {
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
      if (!isExisting && total[i].poolAddress === currency.address.toLowerCase()) {
        temp.push(total[i]);
      }
    }
    setTotalHistories(temp.sort((a, b) => b.timestamp - a.timestamp));
  }, [strigifiedRecentHistories]);

  return (
    <div className="duraton-300 transition-all">
      <HistoryToolBar showType={showType} setShowType={setShowType} criteria={criteria} setCriteria={setCriteria} />
      <UserInfo currency={currency} active={showType >= 3} account={showType === 6 ? criteria : account} />
      <HistoryList
        histories={totalHistories}
        currency={currency}
        loading={loading}
        offset={offset}
        setOffset={setOffset}
      />
    </div>
  );
}

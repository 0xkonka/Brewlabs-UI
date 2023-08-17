import { useEffect, useState } from "react";
import HistoryToolBar from "./HistoryToolBar";
import HistoryList from "./HistoryList";
import { useTradingHistory } from "@hooks/useTokenInfo";
import { useAccount } from "wagmi";
import UserInfo from "../UserInfo";

export default function SwapHistory({ currency }) {
  const { address: account } = useAccount();
  const [showType, setShowType] = useState(0);
  const [criteria, setCriteria] = useState("");
  const [offset, setOffset] = useState(0);

  const getQuery = () => {
    switch (showType) {
      case 0:
        return {
          address: currency.tokenAddresses[0],
          chainId: currency.chainId,
          pair: currency.address,
          amm: currency.swap,
          period: 0,
          limit: 100,
          offset: offset * 100,
          status: "all",
        };
      case 1:
        return {
          address: currency.tokenAddresses[0],
          chainId: currency.chainId,
          pair: currency.address,
          amm: currency.swap,
          period: 0,
          limit: 100,
          offset: offset * 100,
          status: "buy",
        };
      case 2:
        return {
          address: currency.tokenAddresses[0],
          chainId: currency.chainId,
          pair: currency.address,
          amm: currency.swap,
          period: 0,
          limit: 100,
          offset: offset * 100,
          status: "sell",
        };
      case 3:
        return {
          address: currency.tokenAddresses[0],
          chainId: currency.chainId,
          pair: currency.address,
          amm: currency.swap,
          period: 0,
          limit: 100,
          offset: offset * 100,
          status: "all",
          account,
        };
    }
  };

  const { histories, loading } = useTradingHistory(getQuery());
  const [totalHistories, setTotalHistories] = useState([]);

  const stringifiedHistories = JSON.stringify(histories);

  useEffect(() => {
    setTotalHistories([]);
  }, [showType, currency.address]);

  useEffect(() => {
    let temp = [...totalHistories];
    for (let i = 0; i < histories.length; i++) {
      const isExisting = totalHistories.find(
        (history) => history.transactionAddress === histories[i].transactionAddress
      );
      if (!isExisting) temp.push(histories[i]);
    }
    setTotalHistories(temp.sort((a, b) => b.timestamp - a.timestamp));
  }, [stringifiedHistories]);

  // const action = history.fromAddress === currency.tokenAddresses[0].toLowerCase() ? "Sell" : "Buy";
  const filterHistory = (histories) => {
    switch (showType) {
      case 0:
        return histories;
      case 1:
        return histories.filter((history) => history.fromAddress !== currency.tokenAddresses[0].toLowerCase());
      case 2:
        return histories.filter((history) => history.fromAddress === currency.tokenAddresses[0].toLowerCase());
      case 3:
        return histories.filter((history) => history.sender === account?.toLowerCase());
    }
  };

  const _histories = filterHistory(
    totalHistories.filter((history) => history.transactionAddress.toLowerCase().includes(criteria.toLowerCase()))
  );

  return (
    <div className="duraton-300 transition-all">
      <HistoryToolBar showType={showType} setShowType={setShowType} criteria={criteria} setCriteria={setCriteria} />
      <UserInfo currency={currency} active={showType === 3} />
      <HistoryList histories={_histories} currency={currency} loading={loading} offset={offset} setOffset={setOffset} />
    </div>
  );
}

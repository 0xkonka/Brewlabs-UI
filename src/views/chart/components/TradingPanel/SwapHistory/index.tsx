import { useState } from "react";
import HistoryToolBar from "./HistoryToolBar";
import HistoryList from "./HistoryList";
import { useTradingHistory } from "@hooks/useTokenInfo";
import { useAccount } from "wagmi";

export default function SwapHistory({ currency }) {
  const { address: account } = useAccount();
  const [showType, setShowType] = useState(0);
  const [criteria, setCriteria] = useState("");
  const { histories } = useTradingHistory(
    currency.tokenAddresses[0],
    currency.chainId,
    currency.address,
    currency.swap
  );

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
        return histories.filter((history) => history.sender === account.toLowerCase());
    }
  };

  const _histories = filterHistory(
    histories.filter((history) => history.transactionAddress.toLowerCase().includes(criteria.toLowerCase()))
  );

  return (
    <div>
      <HistoryToolBar showType={showType} setShowType={setShowType} criteria={criteria} setCriteria={setCriteria} />
      <HistoryList histories={_histories} currency={currency} />
    </div>
  );
}

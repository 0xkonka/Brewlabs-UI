import { useState } from "react";
import HistoryToolBar from "./HistoryToolBar";
import HistoryList from "./HistoryList";
import { useTradingHistory } from "@hooks/useTokenInfo";
import { useAccount } from "wagmi";

export default function SwapHistory({ currency }) {
  const { address: account } = useAccount();
  const [showType, setShowType] = useState("All");
  const { histories } = useTradingHistory(
    currency.tokenAddresses[0],
    currency.chainId,
    currency.address,
    currency.swap
  );
  const filteredHitories = histories.filter(
    (history) => (showType === "Mine" && history.sender === account.toLowerCase()) || showType === "All"
  );
  return (
    <div>
      <HistoryToolBar showType={showType} setShowType={setShowType} histories={filteredHitories} />
      <HistoryList histories={filteredHitories} />
    </div>
  );
}

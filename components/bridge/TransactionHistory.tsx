import { BridgeToken } from "config/constants/types";
import { useUserHistory } from "hooks/bridge/useUserHistory";
import { useCallback, useState } from "react";
import TransactionCard from "../cards/TransactionCard";
import ClaimErrorModal from "./ClaimErrorModal";

const TOTAL_PER_PAGE = 15;

const TransactionHistory = () => {
  const { transfers } = useUserHistory();

  const [onlyUnReceived, setOnlyUnReceived] = useState(false);
  const [claimErrorShow, setClaimErrorShow] = useState(false);
  const [claimErrorToken, setClaimErrorToken] = useState<BridgeToken>();

  const handleClaimError = useCallback((toToken: BridgeToken) => {
    toToken && setClaimErrorToken(toToken);
    setClaimErrorShow(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setClaimErrorShow(false);
    claimErrorToken && setClaimErrorToken(undefined);
  }, [claimErrorToken]);

  const filteredTransfers = (onlyUnReceived ? transfers.filter((i) => i.receivingTx === null) : transfers) || [];

  const numPages = Math.ceil(filteredTransfers.length / TOTAL_PER_PAGE);
  const page = 1;
  const displayHistory = page
    ? filteredTransfers.slice((page - 1) * TOTAL_PER_PAGE, Math.min(page * TOTAL_PER_PAGE, filteredTransfers.length))
    : filteredTransfers.slice(0, TOTAL_PER_PAGE);

  return (
    <div className="my-20">
      
      <ClaimErrorModal
        open={claimErrorShow}
        token={claimErrorToken}
        onClose={handleModalClose}
      />
      <h2 className="font-brand text-3xl text-slate-600 dark:text-slate-400">Transaction history</h2>

      <div className="no-scrollbar -ml-8 overflow-x-auto p-8">
        <div className="flex flex-row-reverse justify-end">
          {displayHistory.map((item) => (
            <TransactionCard
              key={item.message.messageId}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;

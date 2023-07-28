import { DashboardContext } from "contexts/DashboardContext";
import { useContext } from "react";
import { BigNumberFormat } from "utils/functions";
import StyledButton from "views/directory/StyledButton";

export default function HistoryToolBar({ showType, setShowType, histories }: any) {
  const { walletHistories }: any = useContext(DashboardContext);

  const priceChange = walletHistories.length ? walletHistories[walletHistories.length - 1] - walletHistories[0] : 0;
  let priceChangePercent = walletHistories.length ? (priceChange / walletHistories[0]) * 100 : 0;
  priceChangePercent = isNaN(priceChangePercent) ? 0 : priceChangePercent;

  let totalPrice = walletHistories.length ? walletHistories[walletHistories.length - 1] : 0;

  return (
    <div className="mt-2 flex flex-col items-start justify-between px-0 md:flex-row md:items-center md:px-3">
      <div className="flex w-full md:w-fit">
        <StyledButton
          type={"secondary"}
          className="!h-8 !w-[110px] !border-transparent text-white"
          onClick={() => setShowType("All")}
        >
          <div className="flex items-center">
            <div
              className={`mr-2 h-2 w-2 rounded-full ${
                showType === "All" ? "bg-[#3AFDB7]" : "bg-[#FFFFFFBF]"
              } shadow-[0px_0px_2px_#32FFB5]`}
            />
            <div>Swaps (all)</div>
          </div>
        </StyledButton>
        <div className="mr-4" />
        <StyledButton
          type={"secondary"}
          className="!h-8 !w-[120px] !border-transparent text-white"
          onClick={() => setShowType("Mine")}
        >
          <div className="flex items-center">
            <div
              className={`mr-2 h-2 w-2 rounded-full ${
                showType === "Mine" ? "bg-[#3AFDB7]" : "bg-[#FFFFFFBF]"
              } shadow-[0px_0px_2px_#32FFB5]`}
            />
            <div>Swaps (mine)</div>
          </div>
        </StyledButton>
      </div>
      <div className="primary-shadow ml-0 mt-2 flex h-fit w-full flex-none flex-wrap items-center justify-between rounded bg-[#B9B8B81A] px-3 text-sm text-white sm:h-8 md:ml-4 md:mt-0 md:w-fit md:flex-1">
        <div>Performance</div>
        <div className="flex whitespace-nowrap flex-wrap">
          <div className="mr-6 flex">
            <div className="mr-2">Swaps made</div>
            <div>{histories.length}</div>
          </div>
          <div>Total P/L</div>
          <div className={`flex ${priceChangePercent >= 0 ? "text-[#32FFB5]" : "text-danger"}`}>
            <div className="ml-2">
              {priceChangePercent >= 0 ? "+" : ""}
              {priceChangePercent.toFixed(2)}%{" "}
            </div>
            <div className="ml-2">${BigNumberFormat(totalPrice)} USD</div>
          </div>
        </div>
      </div>
    </div>
  );
}

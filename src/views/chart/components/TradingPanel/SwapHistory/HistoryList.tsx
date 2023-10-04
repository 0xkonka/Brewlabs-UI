import { ContractSVG, NonSellerSVG, WalletSVG } from "@components/dashboard/assets/svgs";
import { BigNumberFormat, getEllipsis, getExplorerLogo, numberWithCommas } from "utils/functions";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";
import { getExplorerLink, getNativeSybmol } from "lib/bridge/helpers";
import StyledPrice from "@components/StyledPrice";
import { Oval } from "react-loader-spinner";
import { useCallback, useEffect, useRef } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { useFetchMarketData, useTokenMarketChart } from "state/prices/hooks";
import HistoryCard from "./HistoryCard";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export default function HistoryList({ histories, currency, loading, tb, setTB, setCriteria, setShowType, isAccount }) {
  const tokenMarketData = useTokenMarketChart(currency.chainId);
  const wrappedHistories = histories.map((history) => {
    const date = new Date(history.timestamp);
    return {
      time: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      action: history.action,
      price: history.price,
      usdValue: numberWithCommas(history.amountStable.toFixed(2)),
      amount: BigNumberFormat(history.amount),
      nativeAmount: BigNumberFormat(
        history.nativeAmount ??
          history.amountStable / tokenMarketData[WNATIVE[currency.chainId].address.toLowerCase()]?.usd
      ),
      type:
        history.action === "buy"
          ? WalletSVG
          : history.walletsCategories.includes("Liquiditypool")
          ? ContractSVG
          : NonSellerSVG,
      txHash: history.transactionAddress,
      ago: timeAgo.format(history.timestamp),
      wallet: history.sender,
      info: history.type,
      chainId: history.chainId,
    };
  });

  const node: any = useRef();
  const stringifiedHistories = JSON.stringify(histories);
  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = node.current;
    if (scrollTop + clientHeight === scrollHeight && !loading && scrollHeight > 50) {
      console.log("reached bottom hook in scroll component");
      setTB(histories[histories.length - 1].timestamp);
    } else {
    }
  }, [node, loading, stringifiedHistories]);

  useEffect(() => {
    if (node.current) {
      node.current.addEventListener("scroll", handleScroll);
      return () => node.current?.removeEventListener("scroll", handleScroll);
    }
  }, [node, handleScroll]);

  return (
    <div className="mt-2 rounded-md p-1.5 text-sm">
      <div className="hidden justify-between rounded-[2px] bg-[#D9D9D91A] p-[4px_12px] text-[#FFFFFFBF] lg:flex">
        <div className="flex">
          <div className="w-[90px]">Tx</div>
          <div className="w-[160px] ">Time</div>
          <div className="w-[110px] ">Ago</div>
          {/* <div className="w-16 text-center">Type</div> */}
          {/* <div className="w-[90px] ">Transaction</div> */}
          <div className="w-[60px] ">Action</div>
          <div className="w-[70px] ">Price</div>
          <div className="w-[90px] ">Maker</div>
        </div>
        <div className="flex">
          <div className="w-20 overflow-hidden text-ellipsis">{currency.symbols[0]}</div>
          <div className="w-14 ">{getNativeSybmol(currency.chainId)}</div>
          <div className="w-20">USD</div>
        </div>
      </div>
      <div
        className="yellowScroll mt-2.5 max-h-[400px] w-[calc(100%+6px)] overflow-x-clip overflow-y-scroll"
        ref={node}
      >
        {wrappedHistories.map((list, i) => {
          return (
            <HistoryCard
              key={i}
              list={list}
              i={i}
              setCriteria={setCriteria}
              setShowType={setShowType}
              currency={currency}
              isAccount={isAccount}
            />
          );
        })}

        {loading ? (
          <div className="flex w-full justify-center py-2">
            <Oval
              width={21}
              height={21}
              color={"white"}
              secondaryColor="black"
              strokeWidth={3}
              strokeWidthSecondary={3}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

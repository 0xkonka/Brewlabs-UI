import { WalletSVG } from "@components/dashboard/assets/svgs";
import { getEllipsis } from "utils/functions";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export default function HistoryList({ histories }) {
  const wrappedHistories = histories.map((history) => {
    const date = new Date(history.timestamp * 1000);
    let index = history.tokenAddresses.indexOf(history.fromAddress);
    index = index === -1 ? 0 : index;
    return {
      time: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      action: index === 0 ? "Buy" : "Sell",
      usdValue: history.amountStable.toFixed(2),
      amount: history.amounts[index].toFixed(2),
      nativeAmount: history.amountNative.toFixed(2),
      type: WalletSVG,
      txHash: getEllipsis(history.transactionAddress, 6, 0),
      ago: timeAgo.format(history.timestamp * 1000),
      wallet: getEllipsis(history.sender, 6, 0),
      info: history.type,
    };
  });
  return (
    <div className="mt-2 rounded-md border border-[#FFFFFF40] p-1.5 text-sm">
      <div className="flex justify-between rounded-[2px] bg-[#D9D9D91A] p-[4px_12px] text-[#FFFFFFBF]">
        <div className="w-[130px]">Time</div>
        <div className="w-[45px] text-center">Action</div>
        <div className="w-[75px] text-center">USD.Val</div>
        <div className="w-[60px] text-center">Amount</div>
        <div className="w-[60px] text-center">BNB</div>
        <div className="w-10 text-center">Type</div>
        <div className="w-[75px] text-center">Transaction</div>
        <div className="w-[100px] text-center">Ago</div>
        <div className="w-[80px] text-center">Wallet</div>
        <div className="w-10">Info</div>
      </div>
      <div className="mt-2.5 overflow-y-scroll yellowScroll max-h-[300px]">
        {wrappedHistories.map((list, i) => {
          return (
            <div
              key={i}
              className={`flex justify-between ${
                i % 2 === 0 ? "bg-[#D9D9D90D]" : "bg-[#D9D9D91A]"
              } cursor-pointer items-center rounded-[2px] border border-transparent p-[4px_12px] ${
                list.action === "Buy"
                  ? "text-[#32FFB5] hover:border-[#32ffb473]"
                  : "text-[#DC4545] hover:border-[#DC454573]"
              }`}
            >
              <div className="w-[130px] whitespace-nowrap">{list.time}</div>
              <div className="w-[45px] text-center">{list.action}</div>
              <div className="w-[75px] text-center">${list.usdValue}</div>
              <div className="w-[60px] text-center">{list.amount}</div>
              <div className="w-[60px] text-center">{list.nativeAmount}</div>
              <div className="flex w-10 justify-center [&>svg]:!h-3 [&>svg]:!w-3">{list.type}</div>
              <div className="w-[75px] text-center">{list.txHash}</div>
              <div className="w-[100px] text-center">{list.ago}</div>
              <div className="w-[80px] text-center">{list.wallet}</div>
              <div className="w-10">{list.info}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

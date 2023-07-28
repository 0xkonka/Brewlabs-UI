import { WalletSVG } from "@components/dashboard/assets/svgs";
import { BigNumberFormat, getEllipsis } from "utils/functions";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";
import { getExplorerLink } from "lib/bridge/helpers";

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
      usdValue: BigNumberFormat(history.amountStable),
      amount: BigNumberFormat(history.amounts[index]),
      nativeAmount: BigNumberFormat(history.amountNative),
      type: WalletSVG,
      txHash: history.transactionAddress,
      ago: timeAgo.format(history.timestamp * 1000),
      wallet: history.sender,
      info: history.type,
      chainId: history.chainId,
    };
  });
  return (
    <div className="mt-2 rounded-md border border-[#FFFFFF40] p-1.5 text-sm">
      <div className="hidden justify-between rounded-[2px] bg-[#D9D9D91A] p-[4px_12px] text-[#FFFFFFBF] lg:flex">
        <div className="w-[130px]">Time</div>
        <div className="w-[45px] text-center">Action</div>
        <div className="w-[75px] text-center">USD.Val</div>
        <div className="w-[60px] text-center">Amount</div>
        <div className="w-[60px] text-center">BNB</div>
        <div className="w-10 text-center">Type</div>
        <div className="w-[75px] text-center">Transaction</div>
        <div className="w-[100px] text-center">Ago</div>
        <div className="w-[80px] text-center">Wallet</div>
        <div className="w-14">Info</div>
      </div>
      <div className="yellowScroll mt-2.5 hidden max-h-[300px] w-[calc(100%+6px)] overflow-x-clip overflow-y-scroll lg:block">
        {wrappedHistories.map((list, i) => {
          return (
            <a href={getExplorerLink(list.chainId, "transaction", list.txHash)} key={i} target="_blank">
              <div
                className={`flex justify-between ${
                  i % 2 === 0 ? "bg-[#D9D9D90D]" : "bg-[#D9D9D91A]"
                } cursor-pointer items-center rounded-[2px] border border-transparent p-[4px_0px_4px_12px] ${
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
                <div className="w-[75px] text-center">{getEllipsis(list.txHash, 6, 0)}</div>
                <div className="w-[100px] text-center">{list.ago}</div>
                <div className="w-[80px] text-center">{getEllipsis(list.wallet, 6, 0)}</div>
                <div className="w-14 overflow-hidden text-ellipsis">{list.info}</div>
              </div>
            </a>
          );
        })}
      </div>
      <div className="yellowScroll mt-2.5 block max-h-[500px] w-[calc(100%+6px)] overflow-x-clip overflow-y-scroll lg:hidden">
        {wrappedHistories.map((list, i) => {
          return (
            <a href={getExplorerLink(list.chainId, "transaction", list.txHash)} key={i} target="_blank">
              <div
                className={`mb-2 flex flex-col ${
                  i % 2 === 0 ? "bg-[#D9D9D90D]" : "bg-[#D9D9D91A]"
                } cursor-pointer rounded-[2px] border border-transparent p-[4px_12px] ${
                  list.action === "Buy"
                    ? "text-[#32FFB5] hover:border-[#32ffb473]"
                    : "text-[#DC4545] hover:border-[#DC454573]"
                }`}
              >
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <div>Time:</div>&nbsp;
                    <div className="whitespace-nowrap">{list.time}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Action:</div>&nbsp;
                    <div className="text-center">{list.action}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <div>USD.Val:</div>&nbsp;
                    <div className="text-center">${list.usdValue}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Amount:</div>&nbsp;
                    <div className="text-center">{list.amount}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <div>BNB:</div>&nbsp;
                    <div className="text-center">{list.nativeAmount}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Type:</div>&nbsp;
                    <div className="flex  justify-center [&>svg]:!h-3 [&>svg]:!w-3">{list.type}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex  items-center ">
                    <div>Transaction:</div>&nbsp;
                    <div className="text-center ">{getEllipsis(list.txHash, 10, 0)}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Ago:</div>&nbsp;
                    <div className="text-center">{list.ago}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <div>Wallet:</div>&nbsp;
                    <div className="text-center">{getEllipsis(list.wallet, 10, 0)}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Info:</div>&nbsp;
                    <div className=" overflow-hidden text-ellipsis">{list.info}</div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

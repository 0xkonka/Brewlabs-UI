import { WalletSVG } from "@components/dashboard/assets/svgs";
import { BigNumberFormat, getEllipsis, getExplorerLogo } from "utils/functions";
import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";
import { getExplorerLink, getNativeSybmol } from "lib/bridge/helpers";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export default function HistoryList({ histories, currency }) {
  const wrappedHistories = histories.map((history) => {
    const date = new Date(history.timestamp * 1000);
    let index = history.tokenAddresses.indexOf(currency.tokenAddresses[0]);
    index = index === -1 ? 0 : index;
    const action = history.fromAddress === currency.tokenAddresses[0].toLowerCase() ? "Sell" : "Buy";
    return {
      time: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      action,
      price: BigNumberFormat(history.pricesStable[index], 3),
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
        <div className="flex">
          <div className="w-[90px]">Tx</div>
          <div className="w-[160px] ">Time</div>
          <div className="w-[90px] ">Ago</div>
          <div className="w-16 text-center">Type</div>
          <div className="w-[90px] ">Transaction</div>
          <div className="w-[60px] ">Action</div>
          <div className="w-[75px] ">Price</div>
        </div>
        <div className="flex">
          <div className="w-[100px] ">{currency.symbols[0]}</div>
          <div className="w-[80px] ">{getNativeSybmol(currency.chainId)}</div>
          <div className="w-14">USD.Val</div>
        </div>
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
                <div className="flex">
                  <div className="flex w-[90px] items-center text-white">
                    <img src={getExplorerLogo(list.chainId)} alt={""} className="mr-1.5 h-4 w-4 rounded-full" />
                    <div>{getEllipsis(list.txHash, 6, 0)}</div>
                  </div>
                  <div className="w-[160px] whitespace-nowrap">{list.time}</div>
                  <div className="w-[90px] whitespace-nowrap text-[#FFFFFF80]">{list.ago}</div>
                  <div className="flex w-16 justify-center [&>svg]:!h-3 [&>svg]:!w-3">{list.type}</div>
                  <div className="w-[90px]">Swap</div>
                  <div className="w-[60px]">{list.action}</div>
                  <div className="w-[75px] text-white">{list.price}</div>
                </div>
                <div className="flex">
                  <div className="w-[100px]">{list.amount}</div>
                  <div className="w-[80px]">{list.nativeAmount}</div>
                  <div className="w-14">{list.usdValue}</div>
                </div>
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
                  <div className="flex items-center text-white">
                    <div className="flex items-center">
                      <img src={getExplorerLogo(list.chainId)} alt={""} className="mr-1.5 h-4 w-4 rounded-full" />
                      <div>{getEllipsis(list.txHash, 20, 0)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="whitespace-nowrap">{list.time}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center text-white">
                    <div>Price:</div>&nbsp;
                    <div className="">{list.price}</div>
                  </div>
                  <div className="flex items-center text-[#FFFFFF80]">
                    <div>Ago:</div>&nbsp;
                    <div className="whitespace-nowrap">{list.ago}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <div>Action:</div>&nbsp;
                    <div className="">{list.action}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex justify-center [&>svg]:!h-3 [&>svg]:!w-3">{list.type}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex  items-center ">
                    <div>{currency.symbols[0]}:</div>&nbsp;
                    <div className="">{list.amount}</div>
                  </div>
                  <div className="flex items-center">
                    <div>{getNativeSybmol(currency.chainId)}:</div>&nbsp;
                    <div className="">{list.nativeAmount}</div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between">
                  <div className="flex items-center">
                    <div>USD.Val:</div>&nbsp;
                    <div className="">{list.usdValue}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Transaction:</div>&nbsp;
                    <div className="">Swap</div>
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

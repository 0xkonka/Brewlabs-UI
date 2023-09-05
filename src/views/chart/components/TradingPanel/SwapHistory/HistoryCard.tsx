import { getEllipsis, getExplorerLogo } from "utils/functions";
import { getExplorerLink } from "lib/bridge/helpers";
import StyledPrice from "@components/StyledPrice";
import useENSName from "@hooks/ENS/useENSName";
import { isAddress } from "utils";

export default function HistoryCard({ list, i }) {
  const { ENSName } = useENSName(isAddress(list.wallet));
  return (
    <a href={getExplorerLink(list.chainId, "transaction", list.txHash)} target="_blank">
      <div
        className={`flex justify-between ${
          i % 2 === 0 ? "bg-[#D9D9D90D]" : "bg-[#D9D9D91A]"
        } cursor-pointer items-center rounded-[2px] border border-transparent p-[4px_0px_4px_12px] ${
          list.action === "Buy" ? "text-[#32FFB5] hover:border-[#32ffb473]" : "text-[#DC4545] hover:border-[#DC454573]"
        }`}
      >
        <div className="flex">
          <div className="flex w-[90px] items-center text-[#FFFFFF80]">
            <img
              src={getExplorerLogo(list.chainId)}
              alt={""}
              className="mr-1.5 h-4 w-4 rounded-full border border-white bg-white"
            />
            <div>{getEllipsis(list.txHash, 6, 0)}</div>
          </div>
          <div className="w-[160px] whitespace-nowrap">{list.time}</div>
          <div className="w-[110px] whitespace-nowrap text-[#FFFFFF80]">{list.ago}</div>
          {/* <div className="flex w-16 items-center justify-center [&>svg]:!h-3 [&>svg]:!w-3">{list.type}</div> */}
          {/* <div className="w-[90px]">Swap</div> */}
          <div className="w-[60px]">{list.action}</div>
          <div className="w-[70px] text-white">
            <StyledPrice price={list.price} itemClassName="!text-[8px]" />
          </div>
          <div className="w-[90px]">{ENSName ?? getEllipsis(list.wallet, 5, 4)}</div>
        </div>
        <div className="flex">
          <div className="w-20">{list.amount}</div>
          <div className="w-14">{list.nativeAmount}</div>
          <div className="w-20">${list.usdValue}</div>
        </div>
      </div>
    </a>
  );
}

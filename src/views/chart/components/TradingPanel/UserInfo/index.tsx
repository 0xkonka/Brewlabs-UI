import { LinkSVG } from "@components/dashboard/assets/svgs";
import useENSName from "@hooks/ENS/useENSName";
import { useTradingHistory } from "@hooks/useTokenInfo";
import { getExplorerLink } from "lib/bridge/helpers";
import { getEllipsis, getExplorerLogo, numberWithCommas } from "utils/functions";
import { useAccount } from "wagmi";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export default function UserInfo({ currency }) {
  const { address: account } = useAccount();
  const isXs = useMediaQuery({ query: "(max-width: 450px)" });
  // const account = "0xae837fd1c51705f3f8f232910dfecb9180541b27";

  const name = useENSName(account);
  const [buyInfo, setBuyInfo] = useState({ usd: 0, amount: 0, txns: 0 });
  const [sellInfo, setSellInfo] = useState({ usd: 0, amount: 0, txns: 0 });
  const { histories } = useTradingHistory(
    currency.tokenAddresses[0],
    currency.chainId,
    currency.address,
    currency.swap,
    0,
    0,
    "all",
    account
  );

  const holdingTime = histories.length ? histories[histories.length - 1].timestamp : 0;
  const strigifiedHistories = JSON.stringify(histories);
  useEffect(() => {
    let _buyInfo = { usd: 0, amount: 0, txns: 0 },
      _sellInfo = { usd: 0, amount: 0, txns: 0 };
    histories.map((history) => {
      let index = history.tokenAddresses.indexOf(currency.tokenAddresses[0]);
      index = index === -1 ? 0 : index;
      if (history.fromAddress !== currency.tokenAddresses[0].toLowerCase()) {
        _buyInfo.txns++;
        _buyInfo.usd += history.amountStable;
        _buyInfo.amount += history.amounts[index];
      } else {
        _sellInfo.txns++;
        _sellInfo.usd += history.amountStable;
        _sellInfo.amount += history.amounts[index];
      }
    });
    setBuyInfo(_buyInfo);
    setSellInfo(_sellInfo);
  }, [strigifiedHistories]);

  const profit = sellInfo.usd - buyInfo.usd;

  return (
    <div className="mt-2 flex h-fit lg:h-[120px]">
      <div className="primary-shadow relative flex flex-1 flex-col justify-between rounded bg-[#B9B8B81A] p-[16px_24px_12px_44px] text-sm lg:flex-row">
        <a
          href={getExplorerLink(currency.chainId, "address", account)}
          target="_blank"
          className="absolute left-3 top-3.5"
        >
          <img
            src={getExplorerLogo(currency.chainId)}
            alt={""}
            className="h-6 w-6 rounded-full border border-white bg-white"
          />
        </a>
        <div>
          <a href={getExplorerLink(currency.chainId, "address", account)} target="_blank" className="flex items-center">
            <div className="flex-1 !text-white">{isXs ? getEllipsis(account, 20, 0) : account}</div>
            <div className="ml-1 text-tailwind hover:text-white [&>svg]:h-3 [&>svg]:w-3">{LinkSVG}</div>
          </a>
          <div>{name.loading ? <br /> : name.ENSName ?? <br />}</div>
          <div className="text-[11px] uppercase text-[#FFFFFF80]">
            <span className="text-[#FFFFFFBF]">HOLDER</span>{" "}
            {holdingTime === 0 ? "No" : timeAgo.format(holdingTime * 1000)}
          </div>
          <div className="text-[11px] text-[#FFFFFF80]">
            <span className="text-[#FFFFFFBF]">SWAPPED</span>{" "}
            <span className="text-[#32FFB5]">${numberWithCommas((buyInfo.usd + sellInfo.usd).toFixed(2))} USD</span>{" "}
            {currency.symbols[0]} VOLUME
          </div>
        </div>
        <div className="mt-4 flex min-w-[50%] flex-col justify-between sm:flex-row lg:mt-0">
          <div className="font-bold">
            <div className="font-normal text-white">Bought</div>
            <div className="text-[#32FFB5]">${numberWithCommas(buyInfo.usd.toFixed(2))}</div>
            <div className="whitespace-nowrap text-[#FFFFFFBF]">
              {numberWithCommas(buyInfo.amount.toFixed(2))} {currency.symbols[0]}
            </div>
            <div className="text-[11px] text-[#FFFFFF80]">{buyInfo.txns} TX TOTAL</div>
          </div>
          <div className="mx-0 my-2 font-bold sm:mx-4 sm:my-0">
            <div className="font-normal text-white">Sold</div>
            <div className="text-[#DC4545]">-${numberWithCommas(sellInfo.usd.toFixed(2))}</div>
            <div className="whitespace-nowrap text-[#FFFFFFBF]">
              {numberWithCommas(sellInfo.amount.toFixed(2))} {currency.symbols[0]}
            </div>
            <div className="text-[11px] text-[#FFFFFF80]">{numberWithCommas(sellInfo.txns)} TX TOTAL</div>
          </div>
          <div className="font-bold">
            <div className="whitespace-nowrap font-normal text-white">Realised P/L</div>
            <div className={profit >= 0 ? "text-[#32FFB5]" : "text-[#DC4545]"}>
              {profit >= 0 ? "" : "-"}${numberWithCommas(Math.abs(profit).toFixed(2))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

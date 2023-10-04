import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getChainLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import PairCard from "./PairCard";
import { ChainId } from "@brewlabs/sdk";

const headers = ["Pair", "Last Price", "24h Change", "24h High", "24h Low", "24h Volume", "24h Volume (USD)", ""];
export default function PairList() {
  const pairs = [{ chainId: ChainId.POLYGON, address: "0x55b66debfa695744d3de43e5e62aff6d128b3379" }];
  const width = ["w-[140px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[120px]", "w-[30px]"];
  return (
    <div className="primary-shadow rounded-md bg-[#18181B] p-[10px_16px_24px_16px] xsm:p-[10px_12px_24px_12px]">
      <div className="font-brand text-xl font-bold text-white">TRADING PAIRS</div>
      <div className="mt-2 hidden justify-between px-4 font-brand text-sm text-[#ffffff75] md:flex">
        {headers.map((data, i) => {
          return (
            <div key={i} className={`${width[i]}`}>
              {data}
            </div>
          );
        })}
      </div>
      <div>
        {pairs.map((pair, i) => {
          return <PairCard pair={pair} key={i} />;
        })}
      </div>
    </div>
  );
}

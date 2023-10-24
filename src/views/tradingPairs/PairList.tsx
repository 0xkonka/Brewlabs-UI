import { useTradingAllPairDatas } from "state/pair/hooks";
import PairCard from "./PairCard";
import { ChainId } from "@brewlabs/sdk";

const headers = ["Pair", "Last Price", "24h Change", "24h High", "24h Low", "24h Volume", "24h Volume (USD)", ""];
export default function PairList({ pairs, setSelectedPair }) {
  const width = ["w-[160px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[120px]", "w-[30px]"];

  return (
    <div className="primary-shadow rounded-md bg-[#18181B] p-[10px_0px_24px_0px] xsm:p-[10px_16px_24px_16px]">
      <div className="font-brand text-xl font-bold text-white">TRADING PAIRS</div>
      <div className="mt-2 hidden justify-between px-4 font-brand text-sm text-[#ffffff75] lg:flex">
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
          return <PairCard pair={pair} key={i} setSelectedPair={setSelectedPair} />;
        })}
      </div>
    </div>
  );
}

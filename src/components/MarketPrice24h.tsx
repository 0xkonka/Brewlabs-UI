import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type MarketPrice24hProps = {
  symbol: string;
  usdPrice: number;
  usd24hChange: number | null;
};

const MarketPrice24h = ({ symbol, usdPrice, usd24hChange }: MarketPrice24hProps) => (
  <>
    <p className="flex items-center justify-start gap-1 text-sm">
      {usd24hChange !== null ? (
        <>
          {usd24hChange > 0 ? (
            <span className="flex items-center text-green-500">
              {usd24hChange.toFixed(3)}% <TrendingUpIcon className="h-3 w-3" />
            </span>
          ) : (
            <span className="flex items-center text-red-500">
              {usd24hChange.toFixed(3)}% <TrendingDownIcon className=" h-3 w-3" />
            </span>
          )}
        </>
      ) : (
        <span className="text-gray-400">NA</span>
      )}
      <span className="text-gray-400">24HR</span>
    </p>
    <p className={`${usd24hChange > 0 ? "text-green-500" : "text-danger-500"} text-[10px]`}>
      {usdPrice} USD = 1.00 {symbol}
    </p>
  </>
);

export default MarketPrice24h;

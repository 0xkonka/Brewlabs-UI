import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type MarketDataProps = {
  marketData: {
    usd: number;
    usd_24h_change: number;
  };
  symbol: string;
};

const MarketPrice24h = ({ marketData, symbol }: MarketDataProps) => {
  const { usd_24h_change: priceChange24h, usd: tokenPrice } = marketData;

  return (
    <>
      <p className="flex items-center justify-start gap-1 text-sm">
        {priceChange24h > 0 ? (
          <span className="flex items-center text-green-500">
            {priceChange24h.toFixed(3)}% <TrendingUpIcon className="h-3 w-3" />
          </span>
        ) : (
          <span className="flex items-center text-red-500">
            {priceChange24h.toFixed(3)}% <TrendingDownIcon className=" h-3 w-3" />
          </span>
        )}
        <span className="text-gray-400">24HR</span>
      </p>
      <p className={`${priceChange24h > 0 ? "text-green-500" : "text-danger-500"} text-[10px]`}>
        {tokenPrice} USD = 1.00 {symbol}
      </p>
    </>
  );
};
export default MarketPrice24h;

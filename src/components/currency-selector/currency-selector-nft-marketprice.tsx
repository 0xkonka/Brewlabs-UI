import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from "lucide-react";

import { asPrice } from "utils/prices";
import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";

import { Skeleton } from "@components/ui/skeleton";

const CurrencySelectorNftMarketPrice = ({ chain, address }: { chain: number; address: string }) => {
  const { data, isError, isLoading, isSuccess } = useMarketNFTCollectionData({ chain, address });

  if (isLoading) return <Skeleton className="h-4 w-20" />;

  if ((!isLoading && isError) || (!isSuccess && !data) || data.error)
    return (
      <div className="flex items-center gap-2 text-xs">
        <AlertTriangleIcon className="h-4 w-4 text-red-500" /> No market data available
      </div>
    );

  return (
    <div className="flex flex-col">
      <h5 className="text-gray-300">Floor price 24hr</h5>
      <span className="text-xl font-bold">${asPrice(data.floor_price.usd, 4)}</span>

      {data.floor_price_in_usd_24h_percentage_change > 0 && (
        <p className="flex gap-2 text-xs text-green-500">
          {data.floor_price_in_usd_24h_percentage_change.toFixed(2)}%<TrendingUpIcon className="h-4 w-4" />
        </p>
      )}
      {data.floor_price_in_usd_24h_percentage_change < 0 && (
        <p className="flex gap-2 text-xs text-red-500">
          {data.floor_price_in_usd_24h_percentage_change.toFixed(2)}% <TrendingDownIcon className="h-4 w-4" />
        </p>
      )}
    </div>
  );
};

export default CurrencySelectorNftMarketPrice;

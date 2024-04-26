import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from "lucide-react";

import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";

import { Skeleton } from "@components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";

const BondColMarketPrice = ({ chain, address }: { chain: number; address: string }) => {
  const { data, isError, isLoading, isSuccess } = useMarketNFTCollectionData({ chain, address });

  if (isLoading) return <Skeleton className="h-4 w-20" />;

  if ((!isLoading && isError) || (!isSuccess && !data) || data?.error)
    return (
      <div className="flex items-center gap-2 text-xs">
        <AlertTriangleIcon className="h-4 w-4 text-red-500" /> NA
      </div>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            ${data.floor_price.usd.toFixed(4)}
            {data.floor_price_in_usd_24h_percentage_change > 0 && <TrendingUpIcon className="h-4 w-4 text-green-500" />}
            {data.floor_price_in_usd_24h_percentage_change < 0 && <TrendingDownIcon className="h-4 w-4 text-red-500" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{data.floor_price_in_usd_24h_percentage_change.toFixed(2)}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BondColMarketPrice;

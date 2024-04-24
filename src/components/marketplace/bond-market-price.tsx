import { TrendingUpIcon, TrendingDownIcon, AlertTriangle } from "lucide-react";

import { useMarketData } from "@hooks/useMarketData";

import { Skeleton } from "@components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";

const BondMarketPrice = ({ chain, address }: { chain: number; address: string }) => {
  const { data, isFetching, isError } = useMarketData({ chain, address });

  if (!isFetching && !data) return <Skeleton className="h-4 w-20" />;

  if ((!isFetching && isError) || !data)
    return (
      <div className="flex items-center gap-2 text-xs">
        <AlertTriangle className="h-4 w-4 text-red-500" /> NA
      </div>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            ${data.usd.toFixed(4)}
            {data.usd_24h_change > 0 && <TrendingUpIcon className="h-4 w-4 text-green-500" />}
            {data.usd_24h_change < 0 && <TrendingDownIcon className="h-4 w-4 text-red-500" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{data.usd_24h_change.toFixed(2)}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BondMarketPrice;

import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from "lucide-react";

import { useMarketData } from "@hooks/useMarketData";

import { Skeleton } from "@components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";

const BondColTokenMarketPrice = ({ chain, address }: { chain: number; address: string }) => {
  const { data, isError, isLoading } = useMarketData({ chain, address });

  if (isLoading) return <Skeleton className="h-4 w-20" />;

  if ((!isLoading && isError) || (!isLoading && !data))
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
            ${Number(data.usd.toFixed(4))}
            {data.usd_24h_change > 0 && <TrendingUpIcon className="h-4 w-4 text-green-500" />}
            {data.usd_24h_change < 0 && <TrendingDownIcon className="h-4 w-4 text-red-500" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{Number(data.usd_24h_change.toFixed(2))}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BondColTokenMarketPrice;

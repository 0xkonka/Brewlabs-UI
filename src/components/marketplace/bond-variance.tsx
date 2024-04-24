import { TrendingUpIcon, TrendingDownIcon, AlertTriangle } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import { useMarketData } from "@hooks/useMarketData";
import type { BondVariance } from "config/schemas/bondVarianceSchema";

const BondVariance = ({ chain, address, bondSalePrice }: { chain: number; address: string; bondSalePrice: number }) => {
  const { data, isFetching, isError } = useMarketData({ chain, address });

  if (!isFetching && !data) return <Skeleton className="h-4 w-20" />;

  if ((!isFetching && isError) || !data)
    return (
      <div className="flex items-center gap-2 text-xs">
        <AlertTriangle className="h-4 w-4 text-red-500" /> NA
      </div>
    );

  return (
    <div className="flex items-center gap-1">
      {((bondSalePrice - data.usd) / bondSalePrice).toFixed(4)}%
      {(bondSalePrice - data.usd) / bondSalePrice > 0 && <TrendingUpIcon className="h-4 w-4 text-green-500" />}
      {(bondSalePrice - data.usd) / bondSalePrice < 0 && <TrendingDownIcon className="h-4 w-4 text-red-500" />}
    </div>
  );
};

export default BondVariance;

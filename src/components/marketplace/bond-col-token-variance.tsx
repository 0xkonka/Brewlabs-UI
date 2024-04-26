import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import { useMarketData } from "@hooks/useMarketData";

const BondColTokenVariance = ({
  chain,
  address,
  bondSalePrice,
}: {
  chain: number;
  address: string;
  bondSalePrice: number;
}) => {
  const { data, isFetching, isError } = useMarketData({ chain, address });

  if (!isFetching && !data) return <Skeleton className="h-4 w-20" />;

  if ((!isFetching && isError) || !data)
    return (
      <div className="flex items-center gap-2 text-xs">
        <AlertTriangle className="h-4 w-4 text-red-500" /> NA
      </div>
    );

  const variance = ((bondSalePrice - data.usd) / bondSalePrice) * 100;

  return (
    <div className="flex items-center gap-1">
      {bondSalePrice < data.usd && <span className="text-red-500">-{Math.abs(variance).toFixed(2)}%</span>}
      {bondSalePrice > data.usd && <span className="text-green-500">+{Math.abs(variance).toFixed(2)}%</span>}
    </div>
  );
};

export default BondColTokenVariance;

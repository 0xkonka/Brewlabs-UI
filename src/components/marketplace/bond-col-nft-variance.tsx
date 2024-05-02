import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";

const BondColNFTVariance = ({
  chain,
  address,
  bondSalePrice,
}: {
  chain: number;
  address: string;
  bondSalePrice: number;
}) => {
  const { data, isLoading, isError, isSuccess } = useMarketNFTCollectionData({ chain, address });

  if (!isLoading && !data) return <Skeleton className="h-4 w-20" />;

  if ((!isLoading && isError) || (!isSuccess && !data) || data?.error)
    return (
      <div className="flex items-center gap-2 text-xs">
        <AlertTriangle className="h-4 w-4 text-red-500" /> NA
      </div>
    );

  const variance = ((bondSalePrice - data.floor_price.usd) / bondSalePrice) * 100;

  return (
    <div className="flex items-center gap-1">
      {bondSalePrice > data.floor_price.usd && <span className="text-red-500">-{Math.abs(variance).toFixed(2)}%</span>}
      {bondSalePrice < data.floor_price.usd && (
        <span className="text-green-500">+{Math.abs(variance).toFixed(2)}%</span>
      )}
    </div>
  );
};

export default BondColNFTVariance;

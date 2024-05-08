import { asPrice } from "utils/prices";

import { Badge } from "@components/ui/badge";
import { Skeleton } from "@components/ui/skeleton";
import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon, ExternalLinkIcon } from "lucide-react";

import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";
import type { SupportedNft } from "config/constants/bond-tokens";

const CurrencySelectorSupportedNftItem = ({ nft }: { nft: SupportedNft }) => {
  const {
    data: supportedNftsData,
    isError,
    isLoading,
  } = useMarketNFTCollectionData({ address: nft.address, chain: nft.chainId });

  return (
    <div className="flex w-full justify-between p-5 pl-0">
      <div className="overflow-hidden rounded-md border border-gray-600">
        <img src={nft.image} className="bg-slate-500 object-cover" alt={nft.name} width={100} height={100} />
      </div>

      <div className="ml-4 flex flex-col">
        <h3 className="mb-1 text-lg font-semibold">{nft.name}</h3>
        <p className="text-xs">{nft.symbol}</p>
        {supportedNftsData && supportedNftsData.explorers && (
          <div className="mt-auto flex gap-2">
            {supportedNftsData.explorers.map((explorer) => (
              <Badge key={explorer.name} variant="outline">
                <a href={explorer.link} target="_blank" rel="noreferrer" className="flex gap-2 text-xs ">
                  {explorer.name} <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto mt-3">
        {isLoading && <Skeleton className="h-4 w-20" />}

        {((!isLoading && isError) || !supportedNftsData || supportedNftsData.error) && (
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangleIcon className="h-4 w-4 text-red-500" /> No market data
          </div>
        )}

        {!isLoading && supportedNftsData && !supportedNftsData.error && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-xl">{asPrice(supportedNftsData.floor_price.usd, 4)}</span>

              {supportedNftsData.floor_price_in_usd_24h_percentage_change > 0 && (
                <TrendingUpIcon className="h-6 w-6 text-green-500" />
              )}
              {supportedNftsData.floor_price_in_usd_24h_percentage_change < 0 && (
                <TrendingDownIcon className="h-6 w-6 text-red-500" />
              )}
            </div>

            <p className="text-sm">{supportedNftsData.floor_price_in_usd_24h_percentage_change.toFixed(2)}%</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencySelectorSupportedNftItem;

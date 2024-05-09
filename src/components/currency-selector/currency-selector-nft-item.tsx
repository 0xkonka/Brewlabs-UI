import { useMemo } from "react";

import { CircleAlertIcon } from "lucide-react";

// import { Skeleton } from "@components/ui/skeleton";

import { getExplorerLogo } from "utils/functions";

import { EvmNftData } from "moralis/common-evm-utils";

import { getNftImage } from "utils/getNftImage";

import CurrencySelectorNftMarketPrice from "components/currency-selector/currency-selector-nft-marketprice";
import { Badge } from "@components/ui/badge";

type CurrencySelectorItemProps = {
  nft: EvmNftData;
  chainId: number;
  isSupported?: boolean;
  onCurrencySelect?: (token: EvmNftData, nftImage: string) => void;
};

const CurrencySelectorNftItem = ({ nft, chainId, onCurrencySelect, isSupported }: CurrencySelectorItemProps) => {
  const nftName = nft.metadata && "name" in nft.metadata ? (nft.metadata.name as string) : nft.name;
  const nftImage = useMemo(() => getNftImage(nft), [nft]);

  return (
    <div className="relative">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://etherscan.io/address/${nft.tokenAddress.lowercase}`}
        className="absolute right-2 top-6 flex items-center gap-2 text-xs text-gray-300 underline"
      >
        Etherscan
        <img src={getExplorerLogo(chainId)} alt="explorer" width={15} height={15} />
      </a>
      <button
        type="button"
        disabled={!isSupported}
        onClick={() => onCurrencySelect(nft, nftImage)}
        className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
      >
        <div className="flex w-full items-center justify-between p-5 pl-0">
          <div className="flex gap-6">
            <div className="relative">
              {!isSupported && (
                <Badge variant="secondary" className="absolute -left-2 -top-2 gap-2">
                  <CircleAlertIcon className="-ml-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
                  <p className="text-red-500">Not supported</p>
                </Badge>
              )}

              <div className="w-40 overflow-hidden rounded-md border border-gray-600">
                <img src={nftImage} className="bg-slate-500 object-cover" alt={nft.name} width={160} height={160} />

                <div className="px-2 py-2">
                  <p className="text-xs">{nft.name}</p>
                  <p className="text-xs">
                    {nft.symbol} - {nft.tokenId}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col py-1">
              <h3 className="mb-1 text-lg font-semibold">{nft.name}</h3>

              <p className="text-xs">{nftName}</p>

              {nft.metadata && "description" in nft.metadata && (
                <p className="mt-3 text-xs">{nft.metadata.description as string}</p>
              )}

              <div className="mt-auto">
                <CurrencySelectorNftMarketPrice chain={chainId} address={nft.tokenAddress.lowercase} />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CurrencySelectorNftItem;

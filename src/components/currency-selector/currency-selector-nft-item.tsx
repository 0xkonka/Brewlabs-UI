import { useMemo } from "react";

// import { Token } from "@brewlabs/sdk";

// import { formatUnits } from "viem";
// import { CircleAlertIcon } from "lucide-react";

// import { useMarketData } from "@hooks/useMarketData";
// import MarketPrice24h from "components/MarketPrice24h";
// import getTokenLogoURL from "utils/getTokenLogoURL";

// import { Skeleton } from "@components/ui/skeleton";

import { EvmNftData } from "moralis/common-evm-utils";

// import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";
// import { useMoralisNFTPrice } from "@hooks/useMoralisNftPrice";

import { getNftImage } from "utils/getNftImage";

type CurrencySelectorItemProps = {
  nft: EvmNftData;
  chainId: number;
  isSupported?: boolean;
  onCurrencySelect?: (token: EvmNftData, nftImage: string) => void;
};

const CurrencySelectorNFTItem = ({ nft, chainId, onCurrencySelect }: CurrencySelectorItemProps) => {
  const nftName = nft.metadata && "name" in nft.metadata ? (nft.metadata.name as string) : nft.name;
  const nftImage = useMemo(() => getNftImage(nft), [nft]);

  return (
    <button
      type="button"
      // disabled={!isSupported}
      onClick={() => onCurrencySelect(nft, nftImage)}
      className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
    >
      <div className="flex w-full items-center justify-between p-5 pl-0">
        <div className="flex gap-3">
          <div className="relative">
            {/* {!isSupported && (
              <CircleAlertIcon className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
            )} */}

            <div className="w-40 overflow-hidden rounded-md border border-gray-600">
              <img src={nftImage} className="bg-slate-500 object-cover" alt={nft.name} width={160} height={160} />

              <div className="px-2 py-2">
                <p className="text-xs">{nft.name}</p>
                <p className="text-xs">{nft.symbol}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{nft.name}</h3>

            <p className="text-xs">{nftName}</p>

            {nft.metadata && "description" in nft.metadata && (
              <p className="mt-3 text-xs">{nft.metadata.description as string}</p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default CurrencySelectorNFTItem;

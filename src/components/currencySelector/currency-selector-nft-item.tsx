import { formatUnits } from "viem";
import { CircleAlertIcon } from "lucide-react";

import { useMarketData } from "@hooks/useMarketData";
import MarketPrice24h from "components/MarketPrice24h";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { Skeleton } from "@components/ui/skeleton";

import type { EvmNft } from "@moralisweb3/common-evm-utils";

import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";
import { useMoralisNFTPrice } from "hooks/useMoralisNFTPrice";

// TODO: Better placement of type def
import { WalletTokensFromMoralis } from "hooks/useMoralisWalletTokens";

type CurrencySelectorItemProps = {
  nft: EvmNft;
  chainId: number;
  isSupported?: boolean;
  handleCurrencySelection?: (token: WalletTokensFromMoralis, tokenPrice: number) => void;
};

function removeAfterIpfs(url) {
  const ipfsIndex = url.indexOf("/ipfs/");
  if (ipfsIndex !== -1) {
    return url.slice(0, ipfsIndex + "/ipfs/".length);
  }
  return url; // if '/ipfs/' not found, return the original URL
}

const createIPFSURL = (tokenUri, imagePath) => {
  // Try this nft.metadata?.image first

  const trimmedUrl = removeAfterIpfs(tokenUri);

  const x = imagePath?.replace("ipfs://", trimmedUrl);

  return x;
};

const CurrencySelectorNFTItem = ({ nft, chainId, handleCurrencySelection }: CurrencySelectorItemProps) => {
  // const amountAsBigInt = BigInt(Number(token.balance));
  // const balance = Number(formatUnits(amountAsBigInt, token.decimals));

  // Get the token price
  // Will retrieve cached value if available
  // const { data: tokenPrice, isLoading, isError } = useMarketData({ chain: chainId, address: token.token_address });

  // console.log(nft.tokenAddress.lowercase);

  const { data, isError, isLoading } = useMoralisNFTPrice({
    chainId,
    nftAddress: nft.tokenAddress.lowercase,
  });

  console.log(data);

  return (
    <button
      type="button"
      // disabled={!isSupported}
      // onClick={() => handleCurrencySelection(token, tokenPrice.usd)}
      className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
    >
      <div className="flex w-full items-center justify-between p-5 pl-0">
        <div className="flex gap-3">
          <div className="relative">
            {/* {!isSupported && (
              <CircleAlertIcon className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
            )} */}

            <div className="overflow-hidden rounded-md border border-gray-600">
              <img
                src={createIPFSURL(nft.tokenUri, nft.metadata?.image)}
                className=" w-40 bg-slate-500 object-cover "
                alt={nft.name}
              />
              <div className="px-2 py-2">
                <p className="text-xs">{nft.metadata?.name}</p>
                <p className="text-xs">{nft.symbol}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{nft.name}</h3>

            <p className="text-xs">{nft.metadata?.name}</p>
            <p className="text-xs">{nft.symbol}</p>
            {/* {tokenPrice && (
              <MarketPrice24h
                usdPrice={tokenPrice.usd}
                usd24hChange={tokenPrice.usd_24h_change}
                symbol={token.symbol}
              />
            )} */}
          </div>
        </div>

        {/* <div className="text-end">
          {!isSupported && <p className="text-red-500">Not supported</p>}
          <p>
            {balance.toFixed(2)} {token.symbol}
          </p>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <p className="text-sm opacity-40">{(balance * tokenPrice?.usd || 0).toFixed(4)} USD</p>
          )}
        </div> */}
      </div>
    </button>
  );
};

export default CurrencySelectorNFTItem;

import { useAccount } from "wagmi";
import { EvmNftData } from "moralis/common-evm-utils";

import { setUserSidebarOpen } from "state";

import { NETWORKS } from "config/constants/networks";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisWalletNFTs } from "@hooks/useMoralisWalletNFTs";

import CurrencySelectorSkeleton from "@components/currency-selector/currency-selector-skeleton";
import CurrencySelectorNFTItem from "./currency-selector-nft-item";

import type { SupportedToken } from "config/constants/bond-tokens";

type CurrencySelectorFromWalletProps = {
  supportedNFTs?: SupportedToken[];
  onCurrencySelect: (token: EvmNftData, nftImage: string) => void;
};

const CurrencySelectorNFTs = ({ onCurrencySelect, supportedNFTs = [] }: CurrencySelectorFromWalletProps) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const { walletNFTs, isLoading } = useMoralisWalletNFTs({ walletAddress: address, chainId });

  const handleCurrencySelection = (token: EvmNftData, nftImage: string) => {
    // Close the side panel
    setUserSidebarOpen(false);
    // Convert currency type to token type
    onCurrencySelect(token, nftImage);
  };

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select an NFT from your wallet</h2>
          <h3 className="text-xl">Only supported tokens are selectable</h3>
        </div>
      </div>

      <div className="mt-3 h-[75svh] w-full overflow-y-auto px-2">
        {isLoading && <CurrencySelectorSkeleton count={6} />}

        {!isLoading && walletNFTs.length === 0 && (
          <div className="rounded border-2 border-dashed border-gray-500 p-4 text-center">
            <p className="text-xl">There are no NFTs in this wallet on {NETWORKS[chainId].chainName}</p>
          </div>
        )}

        {walletNFTs?.map((nft) => (
          <CurrencySelectorNFTItem
            key={nft.tokenHash}
            chainId={chainId}
            nft={nft}
            onCurrencySelect={handleCurrencySelection}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrencySelectorNFTs;

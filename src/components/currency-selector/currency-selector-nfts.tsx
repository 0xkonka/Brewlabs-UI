import { useAccount } from "wagmi";
import { EvmNftData } from "moralis/common-evm-utils";

import { NETWORKS } from "config/constants/networks";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisWalletNFTs } from "@hooks/useMoralisWalletNFTs";

import CurrencySelectorSkeleton from "components/currency-selector/currency-selector-skeleton";
import CurrencySelectorNftItem from "components/currency-selector/currency-selector-nft-item";

import type { SupportedToken } from "config/constants/bond-tokens";

type CurrencySelectorFromWalletProps = {
  supportedNfts?: SupportedToken[];
  onCurrencySelect: (token: EvmNftData, nftImage: string) => void;
};

const CurrencySelectorNfts = ({ onCurrencySelect, supportedNfts = [] }: CurrencySelectorFromWalletProps) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const { walletNFTs, isLoading } = useMoralisWalletNFTs({ walletAddress: address, chainId });

  return (
    <>
      {isLoading && <CurrencySelectorSkeleton count={6} />}

      {!isLoading && walletNFTs.length === 0 && (
        <div className="mx-auto mt-12 w-4/5 rounded-xl border-2 border-dashed border-gray-500 px-4 py-6 text-center">
          <p className="text-xl text-gray-500">There are no NFTs in this wallet on {NETWORKS[chainId].chainName}</p>
        </div>
      )}

      {walletNFTs?.map((nft) => (
        <CurrencySelectorNftItem key={nft.tokenHash} chainId={chainId} nft={nft} onCurrencySelect={onCurrencySelect} />
      ))}
    </>
  );
};

export default CurrencySelectorNfts;

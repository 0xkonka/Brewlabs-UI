/**
 * Gets wallet NFTs for the current user
 * Uses Moralis and TanStack Query
 * THIS SUCCEEDS src\hooks\useWalletTokens.ts - USE THIS INSTEAD
 */

import { useQuery } from "@tanstack/react-query";
import { useEvmWalletNFTs } from "@moralisweb3/next";

export const useMoralisWalletNFTs = ({ walletAddress, chainId }) => {
  const { fetch: fetchNFTBalances } = useEvmWalletNFTs();

  const filterNFTs = (nfts) => nfts.data.filter((nft) => nft.possibleSpam === false);

  const {
    data: walletNFTs,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    select: filterNFTs,
    refetchOnWindowFocus: false,
    queryKey: [`userWalletNFTs_${walletAddress}_${chainId}`],
    queryFn: () => fetchNFTBalances({ address: walletAddress, chain: chainId }),
  });

  return { walletNFTs, isLoading, isFetching, isError };
};

/**
 * Gets wallet NFTs for the current user
 * Uses Moralis and TanStack Query
 * THIS SUCCEEDS src\hooks\useWalletTokens.ts - USE THIS INSTEAD
 */

import { useQuery } from "@tanstack/react-query";
import { useEvmWalletNFTs } from "@moralisweb3/next";

export const useMoralisWalletNFTs = ({ walletAddress, chainId }) => {
  const { fetch: fetchNftBalances } = useEvmWalletNFTs();

  // Remove spam + mBLF from the list of NFTs (brewlabs mirror token)
  const filterNfts = (nfts) => nfts.data.filter((nft) => nft.possibleSpam === false && nft.symbol !== "mBLF");

  const {
    data: walletNFTs,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    select: filterNfts,
    refetchOnWindowFocus: false,
    queryKey: [`userWalletNFTs_${walletAddress}_${chainId}`],
    queryFn: () => fetchNftBalances({ address: walletAddress, chain: chainId }),
  });

  return { walletNFTs, isLoading, isFetching, isError };
};

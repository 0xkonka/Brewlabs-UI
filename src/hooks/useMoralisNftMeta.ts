import { useQuery } from "@tanstack/react-query";
import { useEvmNFTMetadata } from "@moralisweb3/next";

import type { EvmAddress, EvmChain, EvmNftData } from "@moralisweb3/common-evm-utils";

type UseMoralisNftMetaArgs = {
  chainId: EvmChain;
  nftAddress: EvmAddress;
  tokenId: EvmNftData["tokenId"];
};

export const useMoralisNftMeta = ({ nftAddress, chainId, tokenId }: UseMoralisNftMetaArgs) => {
  const { fetch } = useEvmNFTMetadata();

  const { data, isLoading, isFetching, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [`nftMeta_${nftAddress}_${chainId}`],
    queryFn: () => fetch({ chain: chainId, address: nftAddress, tokenId: tokenId.toString() }),
  });

  return { data, isLoading, isFetching, isError };
};

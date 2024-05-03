import { useQuery } from "@tanstack/react-query";
import { useEvmNFTLowestPrice } from "@moralisweb3/next";

export const useMoralisNFTPrice = ({ nftAddress, chainId }) => {
  const { fetch } = useEvmNFTLowestPrice();

  const { data, isLoading, isFetching, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [`nftPrice_${nftAddress}_${chainId}`],
    queryFn: () => fetch({ address: nftAddress, chain: chainId }),
  });

  return { data, isLoading, isFetching, isError };
};

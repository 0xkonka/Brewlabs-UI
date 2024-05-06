import { useQuery } from "@tanstack/react-query";
import { useEvmTokenMetadata } from "@moralisweb3/next";

export const useMoralisTokenMeta = ({ tokenAddress, chainId }) => {
  const { fetch } = useEvmTokenMetadata();

  const { data, isLoading, isFetching, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [`tokenMeta_${tokenAddress}_${chainId}`],
    queryFn: () => fetch({ chain: chainId, addresses: tokenAddress }),
  });

  return { data, isLoading, isFetching, isError };
};

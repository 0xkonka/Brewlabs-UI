import { useQuery } from "@tanstack/react-query";
import { useEvmTokenMetadata } from "@moralisweb3/next";

export const useMoralisTokenMeta = ({ tokenAddress, chainId }) => {
  const { fetch } = useEvmTokenMetadata();

  // TODO: The query key is an array ... is there a better way to do this?
  const { data, isLoading, isFetching, isError } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [`tokenMeta_${tokenAddress}_${chainId}`],
    queryFn: () => fetch({ chain: chainId, addresses: tokenAddress }),
  });

  return { data, isLoading, isFetching, isError };
};

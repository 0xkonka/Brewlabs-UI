import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useSearchParams } from "next/navigation";

import { ChainId } from "@brewlabs/sdk";

import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { useRouter } from "next/router";

export const useActiveChainId = (): { chainId: ChainId; isWrongNetwork: boolean } => {
  const { chain } = useNetwork();
  const { status } = useAccount();

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const chainId = chain?.id;

  const { pathname } = useRouter();
  const page = pathname.split("/").slice(-1)[0];

  // Get URL chainId
  const searchParams = useSearchParams();
  const chainIdFromUrl = Number(searchParams.get("chainId"));

  useEffect(() => {
    const pageValid = Object.keys(PAGE_SUPPORTED_CHAINS).includes(page) ? page : "default";
    const pageSupportedChains = PAGE_SUPPORTED_CHAINS[pageValid] || [];
    const isWrongNetwork = !pageSupportedChains.includes(chainId);

    const urlDoesNotMatchChain = chainIdFromUrl !== undefined && chainIdFromUrl !== chainId && chainIdFromUrl !== 0;

    if (status === "connected") {
      if (urlDoesNotMatchChain && pageSupportedChains.includes(chainIdFromUrl)) {
        setIsWrongNetwork(true);
      }
      if (isWrongNetwork) {
        setIsWrongNetwork(true);
      }
      if (!isWrongNetwork && !urlDoesNotMatchChain) {
        setIsWrongNetwork(false);
      }
    }
  }, [chainId, chainIdFromUrl, isWrongNetwork, page, status]);

  // const { setIsSolanaNetwork } = useSolanaNetwork();
  // useEffect(() => {
  //   if (queryChainId === 900) setIsSolanaNetwork(true);
  //   else setIsSolanaNetwork(false);
  // }, [queryChainId, setIsSolanaNetwork]);

  // const chainId = useMemo(() => {
  //   const chainId = localChainId ?? (queryChainId <= 0 ? 900 : queryChainId);
  //   return chainId;
  // }, [localChainId, queryChainId]);

  // if (localChainId == undefined && queryChainId <= 0) {
  //   return {
  //     chainId: 56,
  //     isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
  //     isNotMatched,
  //   };
  // }

  return {
    chainId,
    isWrongNetwork,
  };
};

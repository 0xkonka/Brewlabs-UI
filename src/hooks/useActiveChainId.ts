import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useSearchParams } from "next/navigation";

import { ChainId } from "@brewlabs/sdk";

import { useRouter } from "next/router";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";

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
    const pageSupportedChains = PAGE_SUPPORTED_CHAINS[page] || [];
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

  return {
    chainId,
    isWrongNetwork,
  };
};

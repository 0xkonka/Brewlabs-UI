import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { ChainId } from "@brewlabs/sdk";
import { useSearchParams } from "next/navigation";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";

export const useActiveChainId = (): { chainId: ChainId; isWrongNetwork: boolean } => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const chainId = chain?.id;

  // Get URL chainId
  const searchParams = useSearchParams();
  const chainIdFromUrl = Number(searchParams.get("chainId"));

  useEffect(() => {
    if (chainIdFromUrl && chainIdFromUrl !== chainId) {
      // Set the chainId from the URL
      switchNetwork(chainIdFromUrl);
    }
  }, [chainId, chainIdFromUrl, switchNetwork]);

  return {
    chainId,
    isWrongNetwork: false,
  };
};

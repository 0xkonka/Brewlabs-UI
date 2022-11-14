import { useRouter } from "next/router";
import { useDeferredValue, useEffect, useState } from "react";
import { useNetwork } from "wagmi";

import { bsc } from "contexts/wagmi";
import { isChainSupported } from "utils/wagmi";
import { useGlobalState } from "state";


export const useQueryChainId = () => {
  const [queryChainId, setQueryChainId] = useState(-1);
  const { query } = useRouter();

  useEffect(() => {
    if (query.chainId === undefined) setQueryChainId(-1);
    if (typeof query.chainId === "string") setQueryChainId(+query.chainId);
  }, [query.chainId]);

  return queryChainId;
};

export function useLocalNetworkChain() {
  const [sessionChainId] = useGlobalState("sessionChainId");
  const queryChainId = useQueryChainId();

  const chainId = +(sessionChainId || queryChainId);
  if (isChainSupported(chainId)) {
    return chainId;
  }

  return undefined;
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain();
  const queryChainId = useQueryChainId();

  const { chain } = useNetwork();
  const chainId = localChainId ?? chain?.id ?? (queryChainId >= 0 ? bsc.id : -1);

  const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId);

  return {
    chainId,
    isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
    isNotMatched,
  };
};

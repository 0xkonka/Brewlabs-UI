import { useMemo } from "react";
import { ChainId, Token } from "@brewlabs/sdk";
import { useSelector } from "react-redux";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { AppState } from "../../index";
import { deserializeToken } from "./helpers";

export default function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveChainId();
  const serializedTokensMap = useSelector<AppState, AppState["user"]["tokens"]>(({ user: { tokens } }) => tokens);

  return useMemo(() => {
    if (!chainId) return [];
    return Object.values(serializedTokensMap?.[chainId as ChainId] ?? {}).map(deserializeToken) as Token[];
  }, [serializedTokensMap, chainId]);
}

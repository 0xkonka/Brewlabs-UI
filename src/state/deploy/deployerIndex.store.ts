import { z } from "zod";
import { toast } from "react-toastify";
import { WNATIVE } from "@brewlabs/sdk";
import type { Token } from "config/schemas/tokenSchema";
import { createGlobalState } from "react-hooks-global-state";
import { indexDeployerSchema } from "config/schemas/indexDeployerSchema";

const getWrappedNativeToken = (token: Token) => (token.isNative ? WNATIVE[token.chainId] : token);

const isDuplicate = (tokens: Token[], token: Token) => {
  return tokens.some((t) => t?.chainId === token.chainId && t?.address === token.address);
};

interface DeployerIndexStore {
  indexTokens: Token[] | undefined[];
  indexInfo: z.infer<typeof indexDeployerSchema>;
  deployerIndexStep: "details" | "confirm" | "success";
  deployedIndexAddress: string;
}

// Create a single global state object
const deployerIndexStore = {
  indexInfo: {
    indexName: "",
  },
  deployerIndexStep: "details",
  indexTokens: new Array(2).fill(undefined),
  deployedIndexAddress: "",
} as DeployerIndexStore;

const { useGlobalState: useDeployerIndexState, setGlobalState } = createGlobalState(deployerIndexStore);

export const setIndexName = (indexName: string) => {
  setGlobalState("indexInfo", (v) => ({ ...v, indexName }));
};

export const setIndexInfo = (indexInfo: z.infer<typeof indexDeployerSchema>) => {
  setGlobalState("indexInfo", indexInfo);
};

export const setIndexToken = (tokens: Token[], token: Token, index: number) => {
  // Get the wrapped version when the token is native
  const wrappedToken = getWrappedNativeToken(token);
  // Check for duplicates
  if (isDuplicate(tokens, wrappedToken)) {
    toast.error("Duplicate token selected");
    return;
  }
  // Update the token at the index
  const updatedTokens = tokens.map((token, idx) => {
    if (idx === index) {
      // If no address suse the wrapped native token
      return wrappedToken;
    } else {
      // The rest haven't changed
      return token;
    }
  });
  setGlobalState("indexTokens", updatedTokens);
};

export const setDeployedIndexAddress = (deployedIndexAddress: string) => {
  setGlobalState("deployedIndexAddress", deployedIndexAddress);
};

export const setDeployerIndexStep = (deployerIndexStep: DeployerIndexStore["deployerIndexStep"]) => {
  setGlobalState("deployerIndexStep", deployerIndexStep);
};

export { useDeployerIndexState };

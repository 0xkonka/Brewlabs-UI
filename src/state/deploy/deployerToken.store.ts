import { z } from "zod";
import { tokenDeployerSchema } from "config/schemas/tokenDeployerSchema";
import { createGlobalState } from "react-hooks-global-state";

interface DeployerTokenStore {
  deployedAddress: string;
  tokenImageDisplayUrl: string;
  deployerStep: "details" | "confirm" | "success";
  tokenInfo: z.infer<typeof tokenDeployerSchema>;
}

// Create a single global state object
const deployerTokenStore = {
  deployedAddress: "",
  deployerStep: "details",
  tokenImageDisplayUrl: "",
  tokenInfo: {
    tokenName: "",
    tokenSymbol: "",
    tokenImage: undefined,
    tokenDecimals: 18,
    tokenTotalSupply: 0,
    tokenDescription: "",
    tokenImmutable: false,
    tokenRevokeFreeze: false,
    tokenRevokeMint: false,
    tokenBurnPercentage: "0",
  },
} as DeployerTokenStore;

const { useGlobalState: useDeployerTokenState, setGlobalState } = createGlobalState(deployerTokenStore);

export const setTokenInfo = (tokenInfo: z.infer<typeof tokenDeployerSchema>) => {
  setGlobalState("tokenInfo", () => tokenInfo);
};

export const setDeployerStep = (step: DeployerTokenStore["deployerStep"]) => {
  setGlobalState("deployerStep", () => step);
};

export const setDeployedAddress = (deployedAddress: string) => {
  setGlobalState("deployedAddress", () => deployedAddress);
};

export const setTokenImageDisplayUrl = (tokenImageDisplayUrl: string) => {
  setGlobalState("tokenImageDisplayUrl", () => tokenImageDisplayUrl);
};

export { useDeployerTokenState };

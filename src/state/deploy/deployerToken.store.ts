import { z } from "zod";
import { tokenDeployerSchema } from "config/schemas/tokenDeployerSchema";
import { createGlobalState } from "react-hooks-global-state";

interface DeployerTokenStore {
  deployedAddress: string;
  tokenImageDisplayUrl: string;
  deployerTokenStep: "details" | "confirm" | "success";
  tokenInfo: z.infer<typeof tokenDeployerSchema>;
}

// Create a single global state object
const deployerTokenStore = {
  deployedAddress: "",
  deployerTokenStep: "details",
  tokenImageDisplayUrl: "",
  tokenInfo: {
    tokenName: "",
    tokenSymbol: "",
    tokenImage: undefined,
    tokenDecimals: 9,
    tokenTotalSupply: 1000,
    tokenDescription: "Token Description",
    tokenImmutable: false,
    tokenRevokeFreeze: false,
    tokenRevokeMint: false,
  },
} as DeployerTokenStore;

const { useGlobalState: useDeployerTokenState, setGlobalState } = createGlobalState(deployerTokenStore);

export const setTokenInfo = (tokenInfo: z.infer<typeof tokenDeployerSchema>) => {
  setGlobalState("tokenInfo", () => tokenInfo);
};

export const setDeployerTokenStep = (step: DeployerTokenStore["deployerTokenStep"]) => {
  setGlobalState("deployerTokenStep", () => step);
};

export const setDeployedAddress = (deployedAddress: string) => {
  setGlobalState("deployedAddress", () => deployedAddress);
};

export const setTokenImageDisplayUrl = (tokenImageDisplayUrl: string) => {
  setGlobalState("tokenImageDisplayUrl", () => tokenImageDisplayUrl);
};

export { useDeployerTokenState };

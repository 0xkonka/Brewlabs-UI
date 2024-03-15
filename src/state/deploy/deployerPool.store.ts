import { z } from "zod";
import { createGlobalState } from "react-hooks-global-state";
import { Token } from "@brewlabs/sdk";
import { poolDeployerSchema } from "config/schemas/poolDeployerSchema";

interface DeployerPoolStore {
  poolInfo: z.infer<typeof poolDeployerSchema>;
  deployerPoolStep: "details" | "confirm" | "success";
}

// Create a single global state object
const deployerPoolStore = {
  poolInfo: {},
  deployerPoolStep: "details",
} as DeployerPoolStore;

const { useGlobalState: useDeployerPoolState, setGlobalState } = createGlobalState(deployerPoolStore);

export const setPoolInfo = (poolInfo: z.infer<typeof poolDeployerSchema>) => {
  setGlobalState("poolInfo", () => poolInfo);
};

export const setPoolToken = (poolToken: Token) => {
  setGlobalState("poolInfo", (v) => ({ ...v, poolToken: poolToken }));
};

export const setPoolRewardToken = (poolRewardToken: Token) => {
  setGlobalState("poolInfo", (v) => ({ ...v, poolRewardToken: poolRewardToken }));
};

export { useDeployerPoolState };

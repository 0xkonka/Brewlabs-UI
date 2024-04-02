import { z } from "zod";
import { createGlobalState } from "react-hooks-global-state";
import { tokenSchema } from "config/schemas/tokenSchema";
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

export const setPoolToken = (poolToken: z.infer<typeof tokenSchema>) => {
  setGlobalState("poolInfo", (v) => ({ ...v, poolToken: poolToken }));
};

export const setPoolRewardToken = (poolRewardToken: z.infer<typeof tokenSchema>) => {
  setGlobalState("poolInfo", (v) => ({ ...v, poolRewardToken: poolRewardToken }));
};

export const setPoolReflectionToken = (poolReflectionToken: z.infer<typeof tokenSchema>) => {
  setGlobalState("poolInfo", (v) => ({ ...v, poolReflectionToken: poolReflectionToken }));
};

export const setDeployerPoolStep = (deployerPoolStep: DeployerPoolStore["deployerPoolStep"]) => {
  setGlobalState("deployerPoolStep", deployerPoolStep);
};

export { useDeployerPoolState };

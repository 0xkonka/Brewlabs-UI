import { z } from "zod";
import { createGlobalState } from "react-hooks-global-state";
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

export const setDeployerPoolStep = (deployerPoolStep: DeployerPoolStore["deployerPoolStep"]) => {
  setGlobalState("deployerPoolStep", deployerPoolStep);
};

export { useDeployerPoolState };

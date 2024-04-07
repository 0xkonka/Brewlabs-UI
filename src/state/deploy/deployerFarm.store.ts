import { createGlobalState } from "react-hooks-global-state";
import { z } from "zod";
import { addressSchema } from "config/schemas/addressSchema";
import { farmDeployerSchema } from "config/schemas/farmDeployerSchema";

import type { LpInfoType } from "@hooks/useLPTokenInfo";
import type { Token, TokenAmount } from "@brewlabs/sdk";

export type FarmDuration = "365" | "180" | "90" | "60";

type Router = {
  key: string;
  id: string;
  name: string;
  address: `0x${string}`;
  factory: `0x${string}`;
};

interface DeployerFarmStore {
  farmInfo: z.infer<typeof farmDeployerSchema>;
  deployerFarmStep: "details" | "confirm" | "success";
  deployedFarmAddress: `0x${string}`;
}

// Create a single global state object
const deployerFarmStore = {
  farmInfo: {},
  deployerFarmStep: "details",
  deployedFarmAddress: "0x",
} as DeployerFarmStore;

const { useGlobalState: useDeployerFarmState, setGlobalState } = createGlobalState(deployerFarmStore);

export const setFarmInfo = (farmInfo: z.infer<typeof farmDeployerSchema>) => {
  setGlobalState("farmInfo", farmInfo);
};

export const setDeployedFarmAddress = (deployedFarmAddress: DeployerFarmStore["deployedFarmAddress"]) => {
  setGlobalState("deployedFarmAddress", deployedFarmAddress);
};

export const setDeployerFarmStep = (step: DeployerFarmStore["deployerFarmStep"]) => {
  setGlobalState("deployerFarmStep", () => step);
};

export { useDeployerFarmState };

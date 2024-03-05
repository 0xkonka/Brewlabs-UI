import { createGlobalState } from "react-hooks-global-state";
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
  deployerFarmStep: "details" | "confirm" | "success";
  farmInfo: {
    router: Router;
    lpInfo: LpInfoType;
    lpAddress: string;
    depositFee: number;
    withdrawFee: number;
    initialSupply: number;
    totalSupply: TokenAmount | 0;
    rewardToken: Token | undefined;
    rewardTokenAddress: string;
    farmDuration: FarmDuration;
    deployedFarmAddress: string;
  };
}

// Create a single global state object
const deployerFarmStore = {
  deployerFarmStep: "details",
  farmInfo: {
    router: {},
    lpInfo: {} as LpInfoType,
    lpAddress: "",
    depositFee: 0,
    withdrawFee: 0,
    initialSupply: 1,
    totalSupply: 0,
    rewardToken: undefined,
    rewardTokenAddress: "",
    farmDuration: "90",
    deployedFarmAddress: "",
  },
} as DeployerFarmStore;

const { useGlobalState: useDeployerFarmState, setGlobalState } = createGlobalState(deployerFarmStore);

export const setRouter = (router: Router) => {
  setGlobalState("farmInfo", (v) => ({ ...v, router }));
};

export const setLpInfo = (lpInfo: LpInfoType) => {
  setGlobalState("farmInfo", (v) => ({ ...v, lpInfo }));
};

export const setLpAddress = (lpAddress: string) => {
  setGlobalState("farmInfo", (v) => ({ ...v, lpAddress }));
};

export const setDepositFee = (depositFee: number) => {
  setGlobalState("farmInfo", (v) => ({ ...v, depositFee }));
};

export const setWithdrawFee = (withdrawFee: number) => {
  setGlobalState("farmInfo", (v) => ({ ...v, withdrawFee }));
};

export const setInitialSupply = (initialSupply: number) => {
  setGlobalState("farmInfo", (v) => ({ ...v, initialSupply }));
};

export const setTotalSupply = (totalSupply: TokenAmount | 0) => {
  setGlobalState("farmInfo", (v) => ({ ...v, totalSupply }));
};

export const setRewardToken = (rewardToken: Token | undefined) => {
  setGlobalState("farmInfo", (v) => ({ ...v, rewardToken }));
};

export const setRewardTokenAddress = (rewardTokenAddress: string) => {
  setGlobalState("farmInfo", (v) => ({ ...v, rewardTokenAddress }));
};

export const setFarmDuration = (farmDuration: "365" | "180" | "90" | "60") => {
  setGlobalState("farmInfo", (v) => ({ ...v, farmDuration }));
};

export const setDeployedFarmAddress = (deployedFarmAddress: string) => {
  setGlobalState("farmInfo", (v) => ({ ...v, deployedFarmAddress }));
};

export const setDeployerFarmStep = (step: DeployerFarmStore["deployerFarmStep"]) => {
  setGlobalState("deployerFarmStep", () => step);
};

export { useDeployerFarmState };

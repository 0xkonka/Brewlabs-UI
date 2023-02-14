import BigNumber from "bignumber.js";
import { DeserializedFarm, SerializedFarm } from "./farms/types";

export interface SerializedDeposit {
  amount: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  unlockTime?: number;
}

export interface DeserializedDeposit {
  amount: BigNumber;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  unlockTime?: number;
}

export interface StakingTVL {
  date: string;
  totalStaked: string;
  totalStakedInUsd: string;
}


export interface BlockState {
  currentBlock: number
  initialBlock: number
}
export interface SerializedFarmsState {
  data: SerializedFarm[];
  userDataLoaded: boolean;
}
export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  userDataLoaded: boolean
}

export interface State {
  block: BlockState
  farms: SerializedFarmsState
}
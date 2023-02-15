import BigNumber from "bignumber.js";

import { DeserializedFarmConfig, SerializedFarmConfig } from "config/constants/types";
import { DeserializedDeposit, SerializedDeposit, StakingTVL } from "state/types";

export type SerializedBigNumber = string;

interface SerializedFarmUserData {
  allowance: string;
  tokenBalance: string;
  stakedBalance: string;
  earnings: string;
  reflections: string;
  deposits: SerializedDeposit[];
}

export interface DeserializedFarmUserData {
  allowance: BigNumber;
  tokenBalance: BigNumber;
  stakedBalance: BigNumber;
  earnings: BigNumber;
  reflections: BigNumber;
  deposits: DeserializedDeposit[];
}

export interface SerializedFarm extends SerializedFarmConfig {
  totalStaked?: SerializedBigNumber;
  rewardPerBlock?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
  depositFee?: string;
  withdrawFee?: string;
  performanceFee?: string;
  userData?: SerializedFarmUserData;
  TVLData?: StakingTVL[];
}
export interface DeserializedFarm extends DeserializedFarmConfig {
  totalStaked?: BigNumber;
  rewardPerBlock?: BigNumber;
  poolWeight?: BigNumber;
  depositFee?: string;
  withdrawFee?: string;
  performanceFee?: string;
  userData?: DeserializedFarmUserData;
  TVLData?: StakingTVL[];
}

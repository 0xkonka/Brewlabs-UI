import { DeserializedFarmConfig, SerializedFarmConfig } from "config/constants/types";
import { DeserializedDeposit, SerializedDeposit } from "state/types";

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
  allowance: BigInt;
  tokenBalance: BigInt;
  stakedBalance: BigInt;
  earnings: BigInt;
  reflections: BigInt;
  deposits: DeserializedDeposit[];
}

export interface SerializedFarm extends SerializedFarmConfig {
  totalStaked?: SerializedBigNumber;
  rewardPerBlock?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
  depositFee?: string;
  withdrawFee?: string;
  performanceFee?: string;
  startBlock?: number;
  endBlock?: number;
  userData?: SerializedFarmUserData;
  TVLData?: number[];
  performanceFees?: number[];
  stakedAddresses?: number[];
}
export interface DeserializedFarm extends DeserializedFarmConfig {
  totalStaked?: BigInt;
  rewardPerBlock?: BigInt;
  poolWeight?: BigInt;
  depositFee?: string;
  withdrawFee?: string;
  performanceFee?: string;
  startBlock?: number;
  endBlock?: number;
  userData?: DeserializedFarmUserData;
  TVLData?: number[];
  performanceFees?: number[];
  stakedAddresses?: number[];
}

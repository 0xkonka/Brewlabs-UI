import BigNumber from "bignumber.js";

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

import { ChainId, Currency } from "@brewlabs/sdk";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

import { Category, PoolCategory, SerializedToken, Version } from "config/constants/types";
import { SerializedBigNumber } from "state/farms/types";
import { State, StakingTVL, SerializedDeposit, DeserializedDeposit } from "state/types";

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>;

interface CorePoolProps {
  type?: Category;
  startBlock?: number;
  endBlock?: number;
  duration?: number;
  depositFee?: number;
  withdrawFee?: number;
  apr?: number;
  stakingTokenPrice?: number;
  earningTokenPrice?: number;
  reflectionTokenPrices?: number[];
  isAutoVault?: boolean;
}

interface PoolConfigBaseProps {
  sousId: number;
  chainId: ChainId;
  contractAddress: string;
  poolCategory: PoolCategory;
  tokenPerBlock: string;
  sortOrder?: number;
  version?: Version;
  harvest?: boolean;
  noCompound?: boolean;
  reflection?: boolean;
  noReflectionCompound?: boolean;
  lockup?: number;
  isServiceFee?: boolean;
  isFinished?: boolean;
  migration?: boolean;
  unverified?: boolean;
  featured?: boolean;
  enableEmergencyWithdraw?: boolean;
  forceEndblock?: number;
  headerSuffix?: string;
  externalSwap?: string;
}

export interface SerializedPoolConfig extends PoolConfigBaseProps {
  earningToken: SerializedToken;
  stakingToken: SerializedToken;
  reflectionTokens?: SerializedToken[];
}

export interface DeserializedPoolConfig extends PoolConfigBaseProps {
  earningToken: Currency;
  stakingToken: Currency;
  reflectionTokens?: Currency[];
}

export interface DeserializedPool extends DeserializedPoolConfig, CorePoolProps {
  totalStaked?: BigNumber;
  stakingLimit?: BigNumber;
  performanceFee?: string;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    lockedBalance: BigNumber;
    pendingReward: BigNumber;
    pendingReflections: BigNumber[];
    deposits: DeserializedDeposit[];
  };
  TVLData?: StakingTVL[];
}

export interface SerializedPool extends SerializedPoolConfig, CorePoolProps {
  totalStaked?: SerializedBigNumber;
  stakingLimit?: SerializedBigNumber;
  performanceFee?: string;
  userData?: {
    allowance: SerializedBigNumber;
    stakingTokenBalance: SerializedBigNumber;
    stakedBalance: SerializedBigNumber;
    lockedBalance: SerializedBigNumber;
    pendingReward: SerializedBigNumber;
    pendingReflections: SerializedBigNumber[];
    deposits: SerializedDeposit[];
  };
  TVLData?: StakingTVL[];
}

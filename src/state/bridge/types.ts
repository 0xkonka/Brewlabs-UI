import { ChainId } from "@brewlabs/sdk";
import { SerializedToken, Version } from "config/constants/types";
import { Address } from "viem";

export interface BridgeToken extends SerializedToken {
  mode?: string;
  mediator?: Address;
  helperContractAddress?: Address;
}

export interface BridgeConfig {
  bridgeDirectionId: number;
  version?: Version;
  homeChainId: ChainId;
  foreignChainId: ChainId;
  homeToken: BridgeToken;
  foreignToken: BridgeToken;
  foreignMediatorAddress: Address;
  homeMediatorAddress: Address;
  foreignAmbAddress: Address;
  homeAmbAddress: Address;
  foreignGraphName: string;
  homeGraphName: string;
  claimDisabled: false;
  tokensClaimDisabled: any[];
  homePerformanceFee?: string;
  foreignPerformanceFee?: string;
}

export interface AmbData {
  [chainId: number]: {
    chainId: ChainId;
    address: Address;
    version?: string;
    requiredBlockConfirmations?: number;
    requiredSignatures?: number;
    validatorContract?: Address;
    validatorList: Address[];
  };
}

export interface MediatorData {
  [chainId: number]: {
    chainId: ChainId;
    address: Address;
    version?: string;
    isNative?: boolean;
    token: BridgeToken;
    bridgedToken?: BridgeToken;
    nativeToken?: BridgeToken;
    graphEndpoint: string;
    performanceFee: string;

    feeManager?: Address;    
    homeToForeignFeeType?: string,
    foreignToHomeFeeType?: string,
    rewarderList: Address[];

    limit: {
      minPerTx: string;
      executionMaxPerTx: string;
      executionDaily: string;
    };

    currentDay: number;
    minPerTx: string;
    maxPerTx: string;
    remainingLimit: string;
    dailyLimit: string;
    totalSpentPerDay: string;
    executionMaxPerTx: string;
    executionDailyLimit: string;
    totalExecutedPerDay: string;

    userData?: {
      balance: string;
      allowance: string;
    };
  };
}

export interface BridgeData extends BridgeConfig {
  ambData: AmbData;
  mediatorData: MediatorData;

  historis: any[];
  requests: any[];
  executions: any[];
}

export interface BridgeState {
  data: {
    [key: number]: BridgeData;
  };
  isLoading: boolean;
}

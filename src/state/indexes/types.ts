import { ChainId, Currency } from "@brewlabs/sdk";
import { SerializedToken, Version } from "config/constants/types";
import { BigNumber } from "ethers";

interface IndexConfigBaseProps {
  pid: number;
  chainId: ChainId;
  contractAddress: string;
  nft: string;
  numTokens: number;
  fee: string;
  sortOrder?: number;
  version?: Version;
  isCustody?: boolean;
  isServiceFee?: boolean;
  isFinished?: boolean;
}

export interface SerializedIndexConfig extends IndexConfigBaseProps {
  tokens: SerializedToken[];
}

export interface DeserializedIndexConfig extends IndexConfigBaseProps {
  tokens: Currency[];
}

export interface IndexHistory {
  method: string;
  amounts: string[];
  usdAmount: string;
  tokenId?: number;
  txHash: string;
  blockNumber: number;
  timestamp: number;
}

export interface DeserializedIndex extends DeserializedIndexConfig {
  totalStaked: BigNumber[];
  performanceFee?: string;
  userData?: {
    allowance: boolean; // nft allowance
    ethBalance: BigNumber;
    nftItems: NFTInfo[]
    stakedUsdAmount: BigNumber;
    stakedBalances: BigNumber[];
    histories: IndexHistory[];
  };
  TVLData?: number[];
  performanceFees?: number[];
}

export type NFTInfo = {
    tokenId: number;
    level: number;
    amounts: string[];
    usdAmount: string;
}

export interface SerializedIndex extends SerializedIndexConfig {
  totalStaked: string[];
  performanceFee?: string;
  userData?: {
    allowance: boolean; // nft allowance
    ethBalance: string;
    nftItems: NFTInfo[]
    stakedUsdAmount: string;
    stakedBalances: string[];
    histories: IndexHistory[];
  };
  TVLData?: number[];
  performanceFees?: number[];
}

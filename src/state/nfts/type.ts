import { ChainId } from "@brewlabs/sdk";
import { SerializedToken } from "config/constants/types";

export interface FlaskNftData {
  chainId: ChainId;
  address: string;
  balances: [{ tokenId: number; rarity: number }];
  brewsToken: SerializedToken;
  stableTokens: SerializedToken[];
  mintFee: { brews: string; stable: string };
  upgradeFee: { brews: string; stable: string };
}

export interface MirrorNftData {
  chainId: ChainId;
  address: string;
  balances: [{ tokenId: number; rarity: number }];
}

export interface NftStakingData {
  chainId: ChainId;
  address: string;
  earningToken: SerializedToken;
  apr: number;
  totalStaked: number;
  stakedInfo: {
    amount: number;
    tokenIds: number[];
  };
  performanceFee?: string;
}

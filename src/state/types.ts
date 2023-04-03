import BigNumber from "bignumber.js";
import { DeserializedFarm, SerializedFarm } from "./farms/types";
import { SerializedIndex } from "./indexes/types";
import { ListsState } from "./lists/reducer";
import { MulticallState } from "./multicall/reducer";
import { SerializedPool } from "./pools/types";
import { SwapState } from "./swap/reducer";
import { TransactionState } from "./transactions/reducer";
import { UserState } from "./user/reducer";

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
export interface BlockState {
  currentBlock: number;
  initialBlock: number;
}
export interface SerializedFarmsState {
  data: SerializedFarm[];
  userDataLoaded: boolean;
}
export interface DeserializedFarmsState {
  data: DeserializedFarm[];
  userDataLoaded: boolean;
}

export interface PoolsState {
  data: SerializedPool[];
  userDataLoaded: boolean;
}
export interface IndexesState {
  data: SerializedIndex[];
  userDataLoaded: boolean;
}

export interface State {
  block: BlockState;
  farms: SerializedFarmsState;
  pools: PoolsState;
  indexes: IndexesState;
  lists: ListsState;
  multicall: MulticallState;
  user: UserState;
  swap: SwapState;
  transactions: TransactionState;
}

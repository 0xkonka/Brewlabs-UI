import { useSelector } from "react-redux";

import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";

import { HomeState, State } from "../types";
import { SerializedTransactionData } from "./type";
import {
  fetchFeeCollectedDataAsync,
  fetchNFTStakingDataAsync,
  fetchTransactionDataAsync,
  fetchTreasuryValueAsync,
} from ".";

export const useFetchHomeData = () => {
  const dispatch = useAppDispatch();

  useSlowRefreshEffect(() => {
    dispatch(fetchTransactionDataAsync());
    dispatch(fetchNFTStakingDataAsync());
    dispatch(fetchFeeCollectedDataAsync());
    dispatch(fetchTreasuryValueAsync());
  }, [dispatch]);
};

export const useHomeTransaction = (): { transactions: SerializedTransactionData } => {
  const { transactions } = useSelector((state: State) => ({
    transactions: state.home.transactions,
  }));
  return { transactions };
};

export const useAllHomeData = () => useSelector((state: State) => state.home);

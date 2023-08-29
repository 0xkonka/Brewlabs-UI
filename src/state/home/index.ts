import { createSlice } from "@reduxjs/toolkit";

import { HomeState } from "state/types";

import { getFeeCollectedValues, getNFTStakingValues, getTransactions, getTreasuryValues } from "./fetchHomeValues";
import { getMarketInfo } from "./fetchMarketInfo";

const initialState: HomeState = {
  transactions: {
    count: null,
    count24h: null,
  },
  nftStakings: {
    apy: null,
    mintCount: null,
  },
  feeCollected: {
    fee: null,
    fee24h: null,
  },
  treasuryValues: {
    value: null,
    value24h: null,
  },
  marketValues: {},
};

export const fetchTransactionDataAsync = () => async (dispatch) => {
  const transactions = await getTransactions();
  dispatch(setTransactionData(transactions));
};

export const fetchNFTStakingDataAsync = () => async (dispatch) => {
  const nftStakings = await getNFTStakingValues();
  dispatch(setNFTStakingData(nftStakings));
};

export const fetchFeeCollectedDataAsync = () => async (dispatch) => {
  const feeDatas = await getFeeCollectedValues();
  dispatch(setFeeCollectedData(feeDatas));
};

export const fetchTreasuryValueAsync = () => async (dispatch) => {
  const treasuryValues = await getTreasuryValues();
  dispatch(setTreasuryValuesData(treasuryValues));
};

export const fetchMarketInfoAsync = (period) => async (dispatch) => {
  const marketValues = await getMarketInfo(period);
  dispatch(setMarketValues({ period, marketValues }));
};

export const HomeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setTransactionData: (state, action) => {
      const transactions = action.payload;
      state.transactions = transactions;
    },
    setNFTStakingData: (state, action) => {
      const nftStakings = action.payload;
      state.nftStakings = nftStakings;
    },
    setFeeCollectedData: (state, action) => {
      const feeDatas = action.payload;
      state.feeCollected = feeDatas;
    },
    setTreasuryValuesData: (state, action) => {
      const treasuryValues = action.payload;
      state.treasuryValues = treasuryValues;
    },
    setMarketValues: (state, action) => {
      const { marketValues, period } = action.payload;
      state.marketValues[period] = marketValues;
    },
  },
});

// Actions
export const { setTransactionData, setNFTStakingData, setFeeCollectedData, setTreasuryValuesData, setMarketValues } =
  HomeSlice.actions;

export default HomeSlice.reducer;

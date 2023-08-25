import { createSlice } from "@reduxjs/toolkit";

import { WalletState } from "state/types";

import { getNFTBalances } from "./fetchNFTBalances";

const initialState: WalletState = {
  nfts: {},
};

export const fetchNFTBalancesAsync = (account: string) => async (dispatch) => {
  const nfts = await getNFTBalances();
  dispatch(setNFTBalance({ account, nfts }));
};

export const HomeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setNFTBalance: (state, action) => {
      const { account, nfts } = action.payload;
      state.nfts[account.toLowerCase()] = nfts;
    },
  },
});

// Actions
export const { setNFTBalance } = HomeSlice.actions;

export default HomeSlice.reducer;

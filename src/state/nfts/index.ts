import { createSlice } from "@reduxjs/toolkit";
import { ChainId } from "@brewlabs/sdk";
import axios from "axios";

import { API_URL } from "config/constants";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { Category } from "config/constants/types";
import { BIG_ZERO } from "utils/bigNumber";
import { NftState } from "state/types";


const initialState: NftState = {
  flaskNft: [],
  mirrorNft: [],
  data: [],
  userDataLoaded: false,
};

export const NftSlice = createSlice({
  name: "nfts",
  initialState,
  reducers: {
    setNftsPublicData: (state, action) => {
      
    },
    resetNftsUserData: (state) => {
      state.data = state.data.map((pool) => {
        return { ...pool, userData: undefined };
      });
      state.userDataLoaded = false;
    },
  },
});

// Actions
export const {
  setNftsPublicData,
  resetNftsUserData,
} = NftSlice.actions;

export default NftSlice.reducer;

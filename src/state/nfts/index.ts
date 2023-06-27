import { createSlice } from "@reduxjs/toolkit";
import { ChainId } from "@brewlabs/sdk";

import { NftState } from "state/types";
import { fetchFlaskNftPublicData, fetchFlaskNftUserData } from "./fetchFlaskNft";
import { fetchNftStakingPublicData, fetchNftStakingUserData } from "./fetchNftStaking";
import { fetchMirrorNftUserData } from "./fetchMirrorNft";

const initialState: NftState = {
  flaskNft: [],
  mirrorNft: [],
  data: [],
  userDataLoaded: false,
};

export const fetchNftPublicDataAsync = (chainId: ChainId) => async (dispatch) => {
  const flaskData = fetchFlaskNftPublicData(chainId);
  dispatch(setNftPublicData({ type: "flaskNft", data: flaskData }));

  const nftStakingInfo = fetchNftStakingPublicData(chainId);
  dispatch(setNftPublicData({ type: "data", data: nftStakingInfo }));
};

export const fetchNftUserDataAsync = (chainId: ChainId, account: string) => async (dispatch, getState) => {
  const config = getState().nfts.flaskNft.filter((p) => p.chainId === chainId);
  const flaskData = fetchFlaskNftUserData(chainId, account, [
    config.brewsToken.address,
    ...config.stableTokens.map((t) => t.address),
  ]);
  dispatch(setNftUserData({ type: "flaskNft", data: flaskData }));

  const mirrorData = fetchMirrorNftUserData(chainId, account);
  dispatch(setNftUserData({ type: "mirrorNft", data: mirrorData }));

  const nftStakingInfo = fetchNftStakingUserData(chainId, account);
  dispatch(setNftUserData({ type: "data", data: nftStakingInfo }));
};

export const NftSlice = createSlice({
  name: "nfts",
  initialState,
  reducers: {
    setNftPublicData: (state, action) => {
      const { type, data } = action.payload;

      const index = state[type].findIndex((p) => p.chainId === data.chainId);
      if (index >= 0) {
        state[type][index] = { ...state[type][index], ...data };
      } else {
        // state[type].push(data);
      }
    },
    setNftUserData: (state, action) => {
      const { type, data } = action.payload;

      const index = state[type].findIndex((p) => p.chainId === data.chainId);
      if (index >= 0) {
        state[type][index] = { ...state[type][index], userData: data.userData };
      }
    },
    resetNftsUserData: (state) => {
      state.flaskNft = state.flaskNft.map((data) => ({ ...data, userData: undefined }));
      state.mirrorNft = state.mirrorNft.map((data) => ({ ...data, userData: undefined }));
      state.data = state.data.map((data) => ({ ...data, userData: undefined }));

      state.userDataLoaded = false;
    },
  },
});

// Actions
export const { setNftPublicData, setNftUserData, resetNftsUserData } = NftSlice.actions;

export default NftSlice.reducer;

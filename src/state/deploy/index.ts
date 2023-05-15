import { createSlice } from "@reduxjs/toolkit";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { ethers } from "ethers";

const initialData = {
  payingToken: ethers.constants.AddressZero,
  serviceFee: "0",
};

const initialState = {
  farm: PAGE_SUPPORTED_CHAINS["deployer"].map((chainId) => ({ chainId, ...initialData })),
  pool: PAGE_SUPPORTED_CHAINS["deployer"].map((chainId) => ({ chainId, ...initialData })),
  indexes: PAGE_SUPPORTED_CHAINS["deployer"].map((chainId) => ({ chainId, ...initialData })),
};

export const deploySlice = createSlice({
  name: "Deploy",
  initialState,
  reducers: {
    setDeployPublicData: (state, action) => {},
  },
});

// Actions
export const { setDeployPublicData } = deploySlice.actions;

export default deploySlice.reducer;

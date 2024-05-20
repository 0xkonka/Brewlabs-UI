import { createSlice } from "@reduxjs/toolkit";
import { ChainId, NATIVE_CURRENCIES } from "@brewlabs/sdk";

import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { serializeToken } from "state/user/hooks/helpers";
import {
  getFarmFactoryAddress,
  getIndexFactoryAddress,
  getPoolFactoryAddress,
  getTokenFactoryAddress,
} from "utils/addressHelpers";
import { fetchFarmFactoryData } from "./fetchFactory";
import { fetchIndexFactoryData } from "./fetchIndex";
import { fetchTokenFactoryData } from "./fetchToken";
import { fetchPoolFactoryData } from "./fetchPoolFactory";

const initialState = {
  token: PAGE_SUPPORTED_CHAINS["deploy-token"]
    .map((chainId) => {
      if (chainId == 900) {
        return null; // Skip mapping for chainId 900 or 901
      }
      return {
        chainId,
        address: getTokenFactoryAddress(chainId as ChainId),
        payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
        serviceFee: "0",
      };
    })
    .filter(Boolean), // Filter out null values
  farm: PAGE_SUPPORTED_CHAINS["deploy-farm"]
    .map((chainId) => {
      return {
        chainId,
        address: getFarmFactoryAddress(chainId as ChainId),
        payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
        serviceFee: "0",
      };
    })
    .filter(Boolean), // Filter out null values
  pool: PAGE_SUPPORTED_CHAINS["deploy-pool"]
    .map((chainId) => {
      if (chainId === 900) {
        return null; // Skip mapping for chainId 900 or 901
      }
      return {
        chainId,
        address: getFarmFactoryAddress(chainId as ChainId),
        payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
        serviceFee: "0",
      };
    })
    .filter(Boolean), // Filter out null values
  indexes: PAGE_SUPPORTED_CHAINS["deploy-index"]
    .map((chainId) => {
      return {
        chainId,
        address: getIndexFactoryAddress(chainId as ChainId),
        payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
        serviceFee: "0",
        depositFeeLimit: 0.25,
        commissionFeeLimit: 1,
      };
    })
    .filter(Boolean), // Filter out null values
  poolFactory: PAGE_SUPPORTED_CHAINS["deploy-pool"]
    .map((chainId) => {
      return {
        chainId,
        address: getPoolFactoryAddress(chainId as ChainId),
        payingToken: serializeToken(NATIVE_CURRENCIES[chainId]),
        serviceFee: "0",
      };
    })
    .filter(Boolean), // Filter out null values
};

export const fetchTokenFactoryDataAsync = (chainId) => async (dispatch) => {
  const result = await fetchTokenFactoryData(chainId);

  dispatch(setDeployPublicData({ type: "token", data: result }));
};

export const fetchFarmFactoryDataAsync = (chainId) => async (dispatch) => {
  const result = await fetchFarmFactoryData(chainId);

  dispatch(setDeployPublicData({ type: "farm", data: result }));
};

export const fetchPoolFactoryDataAsync = (chainId) => async (dispatch) => {
  const result = await fetchPoolFactoryData(chainId);
  dispatch(setDeployPublicData({ type: "poolFactory", data: result }));
};

export const fetchIndexFactoryDataAsync = (chainId) => async (dispatch) => {
  const result = await fetchIndexFactoryData(chainId);

  dispatch(setDeployPublicData({ type: "indexes", data: result }));
};

export const deploySlice = createSlice({
  name: "Deploy",
  initialState,
  reducers: {
    setDeployPublicData: (state, action) => {
      const { type, data } = action.payload;
      const index = state[type].findIndex((entry) => entry.chainId === data.chainId);
      state[type][index] = { ...state[type][index], ...data };
    },
  },
});

// Actions
export const { setDeployPublicData } = deploySlice.actions;

export default deploySlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { Address } from "viem";

import { bridgeConfigs } from "config/constants/bridge";
import { fetchAmbData } from "./fetchAmb";
import { fetchBridgeUserData, fetchMediatorData, fetchMediatorLimitData } from "./fetchMediator";

const initData = {
  currentDay: 0,
  minPerTx: "0",
  maxPerTx: "0",
  remainingLimit: "0",
  dailyLimit: "0",
  totalSpentPerDay: "0",
  executionMaxPerTx: "0",
  executionDailyLimit: "0",
  totalExecutedPerDay: "0",
  rewarderList: [],
  limit: {
    minPerTx: "0",
    executionMaxPerTx: "0",
    executionDaily: "0",
  },
  userData: {
    balance: "0",
    allowance: "0",
  },
};

const initialState = {
  data: [{} as any, ...bridgeConfigs].reduce((prev, cur) => ({
    ...prev,
    [cur.bridgeDirectionId]: {
      ...cur,
      ambData: {
        [cur.homeChainId]: {
          chainId: cur.homeChainId,
          address: cur.homeAmbAddress,
          validatorList: [],
        },
        [cur.foreignChainId]: {
          chainId: cur.foreignChainId,
          address: cur.foreignAmbAddress,
          validatorList: [],
        },
      },
      mediatorData: {
        [cur.homeChainId]: {
          chainId: cur.homeChainId,
          address: cur.homeMediatorAddress,
          token: cur.homeToken,
          bridgedToken: cur.foreignToken,
          graphEndpoint: cur.homeGraphName,
          performanceFee: cur.homePerformanceFee,
          ...initData,
        },
        [cur.foreignChainId]: {
          chainId: cur.foreignChainId,
          address: cur.foreignMediatorAddress,
          token: cur.foreignToken,
          bridgedToken: cur.homeToken,
          graphEndpoint: cur.foreignGraphName,
          performanceFee: cur.foreignPerformanceFee,
          ...initData,
        },
      },
      historis: [],
      requests: [],
      executions: [],
    },
  })),
  isLoading: true,
};

export const fetchAmbDataAsync = (bridgeId?: number) => async (dispatch) => {
  bridgeConfigs
    .filter((c) => !bridgeId || c.bridgeDirectionId === bridgeId)
    .forEach(async (config) => {
      const [homeData, foreginData] = await Promise.all([
        fetchAmbData(config.homeChainId, config.homeAmbAddress),
        fetchAmbData(config.foreignChainId, config.foreignAmbAddress),
      ]);

      dispatch(
        setAmbData({
          id: config.bridgeDirectionId,
          homeChainId: config.homeChainId,
          foreginChainId: config.foreignChainId,
          homeData,
          foreginData,
        })
      );
    });
};

export const fetchMeidatorDataAsync = (bridgeId?: number) => async (dispatch) => {
  bridgeConfigs
    .filter((c) => !bridgeId || c.bridgeDirectionId === bridgeId)
    .forEach(async (config) => {
      const [homeData, foreginData] = await Promise.all([
        fetchMediatorData(config.homeChainId, config.homeMediatorAddress, config.homeToken.address as Address),
        fetchMediatorData(config.foreignChainId, config.foreignMediatorAddress, config.foreignToken.address as Address),
      ]);

      dispatch(
        setMediatorData({
          id: config.bridgeDirectionId,
          homeChainId: config.homeChainId,
          foreginChainId: config.foreignChainId,
          homeData,
          foreginData,
        })
      );
    });
};

export const fetchMeidatorLimitDataAsync = (bridgeId?: number) => async (dispatch) => {
  const config = bridgeConfigs.find((c) => c.bridgeDirectionId === bridgeId);
  if (!config) return;

  const [homeData, foreginData] = await Promise.all([
    fetchMediatorLimitData(config.homeChainId, config.homeMediatorAddress, config.homeToken.address as Address),
    fetchMediatorLimitData(
      config.foreignChainId,
      config.foreignMediatorAddress,
      config.foreignToken.address as Address
    ),
  ]);

  dispatch(
    setMediatorData({
      id: config.bridgeDirectionId,
      homeChainId: config.homeChainId,
      foreginChainId: config.foreignChainId,
      homeData,
      foreginData,
    })
  );
};

export const fetchMediatorUserDataAsync = (account: Address, bridgeId?: number) => async (dispatch) => {
  bridgeConfigs
    .filter((c) => !bridgeId || c.bridgeDirectionId === bridgeId)
    .forEach(async (config) => {
      const [homeData, foreginData] = await Promise.all([
        fetchBridgeUserData(
          config.homeChainId,
          config.homeToken.address as Address,
          account,
          config.homeMediatorAddress
        ),
        fetchBridgeUserData(
          config.foreignChainId,
          config.foreignToken.address as Address,
          account,
          config.foreignMediatorAddress
        ),
      ]);

      dispatch(
        setUserData({
          id: config.bridgeDirectionId,
          homeChainId: config.homeChainId,
          foreginChainId: config.foreignChainId,
          homeData,
          foreginData,
        })
      );
    });
};

export const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    setAmbData: (state, action) => {
      const { id, homeChainId, foreginChainId, homeData, foreginData } = action.payload;

      state.data[id] = {
        ...state.data[id],
        ambData: {
          [homeChainId]: {
            ...state.data[id].ambData[homeChainId],
            ...homeData,
          },
          [foreginChainId]: {
            ...state.data[id].ambData[foreginChainId],
            ...foreginData,
          },
        },
      };
    },
    setMediatorData: (state, action) => {
      const { id, homeChainId, foreginChainId, homeData, foreginData } = action.payload;

      state.data[id] = {
        ...state.data[id],
        mediatorData: {
          [homeChainId]: {
            ...state.data[id].mediatorData[homeChainId],
            ...homeData,
          },
          [foreginChainId]: {
            ...state.data[id].mediatorData[foreginChainId],
            ...foreginData,
          },
        },
      };
    },
    setUserData: (state, action) => {
      const { id, homeChainId, foreginChainId, homeData, foreginData } = action.payload;

      state.data[id] = {
        ...state.data[id],
        mediatorData: {
          [homeChainId]: {
            ...state.data[id].mediatorData[homeChainId],
            userData: homeData,
          },
          [foreginChainId]: {
            ...state.data[id].mediatorData[foreginChainId],
            userData: foreginData,
          },
        },
      };
    },
    resetUserData: (state, action) => {
      const id = action.payload;

      state.data[id] = {
        ...state.data[id],
        mediatorData: {
          [state.data[id].homeChainId]: {
            ...state.data[id].mediatorData[state.data[id].homeChainId],
            userData: { balance: "0", allowance: "0" },
          },
          [state.data[id].foreginChainId]: {
            ...state.data[id].mediatorData[state.data[id].foreginChainId],
            userData: { balance: "0", allowance: "0" },
          },
        },
      };
    },
  },
});

// Actions
export const { setAmbData, setMediatorData, setUserData, resetUserData } = bridgeSlice.actions;

export default bridgeSlice.reducer;

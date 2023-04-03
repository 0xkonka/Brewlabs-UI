import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "config/constants";
import { Category } from "config/constants/types";
import { IndexesState } from "state/types";

import { SerializedIndex } from "./types";

const initialState: IndexesState = {
  data: [],
  userDataLoaded: false,
};

export const fetchIndexesPublicDataFromApiAsync = () => async (dispatch) => {
  axios.post(`${API_URL}/indexes`).then((res) => {
    let indexes = [];
    if (res.data) {
      indexes = res.data.map((pool) => ({ type: Category.INDEXES, ...pool }));
    }
    dispatch(setIndexesPublicData(indexes));

    const pids = indexes.map((pool) => pool.pid);
    dispatch(fetchIndexesTVLDataAsync(pids));
  });
};

export const fetchIndexesTVLDataAsync = (pids) => async (dispatch, getState) => {
  const indexes = getState().indexes.data.filter((pool) => pids.includes(pool.pid));
  if (indexes.length === 0) return;

  axios.post(`${API_URL}/tvl/multiple`, { type: "index", ids: indexes.map((p) => p.pid) }).then((res) => {
    const ret = res?.data ?? [];

    const TVLData = [];
    for (let pool of indexes) {
      let record = { pid: pool.pid, data: [] };
      record.data = ret.filter((d) => d.pid === pool.pid).map((r) => r.totalStaked);

      if (record.data.length > 0) {
        TVLData.push(record);
      }
    }
    dispatch(setPoolTVLData(TVLData));
  });
};

export const fetchIndexesUserDepositDataAsync = (account: string) => async (dispatch, getState) => {
  const indexes = getState().indexes.data;
  if (indexes.length === 0) return;

  axios
    .post(`${API_URL}/deposit/${account}/multiple`, { type: "index", ids: indexes.map((p) => p.pid) })
    .then((res) => {
      const ret = res?.data ?? [];

      const depositData = [];
      for (let pool of indexes) {
        let record = { pid: pool.pid, deposits: [] };
        record.deposits = ret.filter((d) => d.pid === pool.pid);

        depositData.push(record);
      }
      dispatch(setIndexesUserData(depositData));
    });
};

export const IndexesSlice = createSlice({
  name: "Indexes",
  initialState,
  reducers: {
    setIndexesPublicData: (state, action) => {
      const liveIndexesData: SerializedIndex[] = action.payload;
      liveIndexesData.map((pool) => {
        const index = state.data.findIndex((p) => p.pid === pool.pid);
        if (index >= 0) {
          state.data[index] = { ...state.data[index], ...pool };
        } else if (pool.contractAddress) {
          state.data.push(pool);
        }
        return pool;
      });
    },
    setIndexesUserData: (state, action) => {
      const userData = action.payload;
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.pid === pool.pid);
        return { ...pool, userData: { ...pool.userData, ...userPoolData } };
      });
      state.userDataLoaded = true;
    },
    updateIndexesUserData: (state, action) => {
      const { field, value, pid } = action.payload;
      const index = state.data.findIndex((p) => p.pid === pid);

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } };
      }
    },
    setPoolTVLData: (state, action) => {
      action.payload.forEach((tvlDataEl) => {
        const { pid, data } = tvlDataEl;
        const index = state.data.findIndex((pool) => pool.pid === pid);
        state.data[index] = { ...state.data[index], TVLData: data };
      });
      state.userDataLoaded = true;
    },
    resetIndexesUserData: (state) => {
      state.data = state.data.map((pool) => {
        return { ...pool, userData: undefined };
      });
      state.userDataLoaded = false;
    },
  },
});

// Actions
export const { setIndexesPublicData, setIndexesUserData, updateIndexesUserData, setPoolTVLData, resetIndexesUserData } =
  IndexesSlice.actions;

export default IndexesSlice.reducer;

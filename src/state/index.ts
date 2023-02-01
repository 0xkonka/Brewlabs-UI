import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useMemo, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { createGlobalState } from "react-hooks-global-state";
import { NetworkConfig } from "config/constants/types";

import { updateVersion } from "./global/actions";

import storage from "./storage";
import farmsReducer from "./farms";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import swap from "./swap/reducer";
import lists from "./lists/reducer";
import multicall from "./multicall/reducer";
import { BridgeToken } from "config/constants/types";

const PERSISTED_KEYS: string[] = ["user", "transactions"];

const persistConfig = {
  key: "primary",
  whitelist: PERSISTED_KEYS,
  blacklist: ["profile"],
  storage,
  version: 1,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    farms: farmsReducer,
    user,
    transactions,
    swap,
    multicall,
    lists,
  })
);

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>;

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === "development",
    preloadedState,
  });
}

export const initializeStore = (preloadedState: any = undefined) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    // store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;

  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
};

store = initializeStore();

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;

export const persistor = persistStore(store, undefined, () => {
  store.dispatch(updateVersion());
});

export function useStore(initialState: any) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}

const userBridgeNetworkInitial = {
  id: 0,
  name: "",
  image: "",
};

const userState: {
  userPoolsStakeOnly: boolean;
  userBridgeTo: NetworkConfig;
  userBridgeFrom: NetworkConfig;
  userBridgeFromToken: BridgeToken | undefined;
  userBridgeLocked: boolean;
  userBridgeAmount: number;
} = {
  userPoolsStakeOnly: false,
  userBridgeTo: userBridgeNetworkInitial,
  userBridgeFrom: userBridgeNetworkInitial,
  userBridgeFromToken: undefined,
  userBridgeLocked: false,
  userBridgeAmount: 0,
};

// Create a single global state object
const initialState1 = {
  ...userState,
  modalIsOpen: false,
  mobileNavOpen: false,
  userSidebarOpen: false,
  userSidebarContent: null,
  sessionChainId: undefined as any,
};

const { useGlobalState, setGlobalState } = createGlobalState(initialState1);

export { useGlobalState, setGlobalState };

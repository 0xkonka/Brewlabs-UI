import { createGlobalState } from "react-hooks-global-state";

const userState = {
  userPoolsStakeOnly: false,
  userBridgeTo: "No network selected",
  userBridgeFrom: "No network selected",
  userBridgeLocked: false,
  userBridgeAmount: 0,
};

// Create a single global state object
const initialState = {
  ...userState,
  showBackdrop: false,
  mobileNavOpen: false,
  userSidebarOpen: false,
};

const { useGlobalState, setGlobalState } = createGlobalState(initialState);

export { useGlobalState, setGlobalState };

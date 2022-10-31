import { createGlobalState } from "react-hooks-global-state";

const userState = {
  userPoolsStakeOnly: false,
  userBridgeTo: "No network selected",
  userBridgeFrom: "No network selected",
};

const initialState = {
  ...userState,
  showBackdrop: false,
  mobileNavOpen: false,
  userSidebarOpen: false,
};

const { useGlobalState, setGlobalState } = createGlobalState(initialState);

export { useGlobalState, setGlobalState };

import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  showBackdrop: false,
  mobileNavOpen: false,
  userSidebarOpen: false,
};

const { useGlobalState, setGlobalState } = createGlobalState(initialState);

export { useGlobalState, setGlobalState };

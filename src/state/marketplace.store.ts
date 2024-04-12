import { createGlobalState } from "react-hooks-global-state";

// Create a single global state object
const marketplaceStore = {
  investModalOpen: false,
  investmentBond: null,
};

const { useGlobalState: useMarketplaceStore, setGlobalState } = createGlobalState(marketplaceStore);

// Actions
export const setInvestModalOpen = (investModalOpen: boolean) => {
  setGlobalState("investModalOpen", investModalOpen);
};

export const setInvestmentBond = (investmentBond: any) => {
  setGlobalState("investmentBond", investmentBond);
};

export { useMarketplaceStore };

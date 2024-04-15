import { createGlobalState } from "react-hooks-global-state";

import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

interface MarketplaceStore {
  investModalOpen: boolean;
  createModalOpen: boolean;
  investmentBond: BondColumnsInvest | null;
}

// Consider splitting this into several stores

// Create a single global state object
const marketplaceStore = {
  investModalOpen: false,
  createModalOpen: false,
  investmentBond: null,
} as MarketplaceStore;

const { useGlobalState: useMarketplaceStore, setGlobalState } = createGlobalState(marketplaceStore);

// Actions
export const setInvestModalOpen = (investModalOpen: boolean) => {
  setGlobalState("investModalOpen", investModalOpen);
};

export const setCreateModalOpen = (createModalOpen: boolean) => {
  setGlobalState("createModalOpen", createModalOpen);
};

export const setInvestmentBond = (investmentBond: any) => {
  setGlobalState("investmentBond", investmentBond);
};

export { useMarketplaceStore };

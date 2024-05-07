import { createGlobalState } from "react-hooks-global-state";

import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

import type { EvmNftData } from "moralis/common-evm-utils";

interface MarketplaceStore {
  nftModalOpen: boolean;
  investModalOpen: boolean;
  createModalOpen: boolean;
  viewableNft: EvmNftData;
  investmentBond: BondColumnsInvest;
}

// Consider splitting this into several stores

// Create a single global state object
const marketplaceStore = {
  nftModalOpen: false,
  investModalOpen: false,
  createModalOpen: false,
  investmentBond: {},
  viewableNft: {},
} as MarketplaceStore;

const { useGlobalState: useMarketplaceStore, setGlobalState } = createGlobalState(marketplaceStore);

// Actions
export const setNftModalOpen = (nftModalOpen: boolean) => {
  setGlobalState("nftModalOpen", nftModalOpen);
};

export const setInvestModalOpen = (investModalOpen: boolean) => {
  setGlobalState("investModalOpen", investModalOpen);
};

export const setCreateModalOpen = (createModalOpen: boolean) => {
  setGlobalState("createModalOpen", createModalOpen);
};

export const setInvestmentBond = (investmentBond: BondColumnsInvest) => {
  setGlobalState("investmentBond", investmentBond);
};

export const setViewableNft = (viewableNft: EvmNftData) => {
  setGlobalState("viewableNft", viewableNft);
};

export { useMarketplaceStore };

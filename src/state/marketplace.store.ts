import { createGlobalState } from "react-hooks-global-state";

import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

import type { EvmNftData } from "moralis/common-evm-utils";

interface MarketplaceStore {
  nftModalOpen: boolean;
  createModalOpen: boolean;
  investNftModalOpen: boolean;
  investTokenModalOpen: boolean;
  viewableNft: EvmNftData;
  investmentNftBond: BondColumnsInvest;
  investmentTokenBond: BondColumnsInvest;
}

// Consider splitting this into several stores

// Create a single global state object
const marketplaceStore = {
  nftModalOpen: false,
  createModalOpen: false,
  investTokenModalOpen: false,
  investNftModalOpen: false,
  viewableNft: {},
  investmentNftBond: {},
  investmentTokenBond: {},
} as MarketplaceStore;

const { useGlobalState: useMarketplaceStore, setGlobalState } = createGlobalState(marketplaceStore);

// Actions
export const setNftModalOpen = (nftModalOpen: boolean) => {
  setGlobalState("nftModalOpen", nftModalOpen);
};

export const setCreateModalOpen = (createModalOpen: boolean) => {
  setGlobalState("createModalOpen", createModalOpen);
};

export const setInvestTokenModalOpen = (investTokenModalOpen: boolean) => {
  setGlobalState("investTokenModalOpen", investTokenModalOpen);
};

export const setInvestmentTokenBond = (investmentTokenBond: BondColumnsInvest) => {
  setGlobalState("investmentTokenBond", investmentTokenBond);
};

export const setInvestNftModalOpen = (investNftModalOpen: boolean) => {
  setGlobalState("investNftModalOpen", investNftModalOpen);
};

export const setInvestmentNftBond = (investmentNftBond: BondColumnsInvest) => {
  setGlobalState("investmentNftBond", investmentNftBond);
};

export const setViewableNft = (viewableNft: EvmNftData) => {
  setGlobalState("viewableNft", viewableNft);
};

export { useMarketplaceStore };

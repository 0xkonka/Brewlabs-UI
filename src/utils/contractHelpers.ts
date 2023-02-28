import { ethers } from "ethers";
import { ChainId } from "@brewlabs/sdk";
import { brewsToken } from "config/constants/tokens";
import { AppId, Chef } from "config/constants/types";

// ABI
import bep20Abi from "config/abi/erc20.json";
import erc721Abi from "config/abi/erc721.json";
import aggregatorAbi from "config/abi/brewlabsAggregator.json";
import brewlabsAggregationRouter from "config/abi/BrewlabsAggregationRouter.json";
import verifictionAbi from "config/abi/brewlabsFactoryVerification.json";
import lockupStaking from "config/abi/brewlabsLockup.json";
import lpManagerAbi from "config/abi/brewlabsLiquidityManager.json";
import zapperAbi from "config/abi/brewlabsZapInConstructor.json";
import externalMasterChefAbi from "config/abi/externalMasterchef.json";
import lpTokenAbi from "config/abi/lpToken.json";
import masterChef from "config/abi/masterchef.json";
import masterChefV2 from "config/abi/masterchefV2.json";
import MultiCallAbi from "config/abi/Multicall.json";
import singleStaking from "config/abi/singlestaking.json";
import claimableTokenAbi from "config/abi/claimableToken.json";
import dividendTrackerAbi from "config/abi/dividendTracker.json";
import UnLockAbi from "config/abi/brewlabsUnLockup.json";

// Addresses
import {
  getMulticallAddress,
  getLpManagerAddress,
  getAggregatorAddress,
  getZapperAddress,
  getVerificationAddress,
  getPancakeMasterChefAddress,
  getExternalMasterChefAddress,
  getBrewlabsAggregationRouterAddress,
} from "utils/addressHelpers";
import { provider } from "./wagmi";

export const getContract = (
  chainId: ChainId,
  address: string,
  abi: any,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  const signerOrProvider = signer ?? provider({ chainId });
  return new ethers.Contract(address, abi, signerOrProvider);
};
export const getBrewsTokenContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, brewsToken[chainId].address, bep20Abi, signer);
};

export const getClaimableTokenContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, claimableTokenAbi, signer);
};

export const getDividendTrackerContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, dividendTrackerAbi, signer);
};

export const getBep20Contract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, bep20Abi, signer);
};
export const getErc721Contract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, erc721Abi, signer);
};
export const getLpContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, lpTokenAbi, signer);
};
export const getSingleStakingContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, singleStaking, signer);
};
export const getLockupStakingContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, lockupStaking, signer);
};

export const getUnLockStakingContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, UnLockAbi, signer);
};

export const getLpManagerContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, getLpManagerAddress(chainId), lpManagerAbi, signer);
};
export const getMasterchefContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, masterChefV2, signer);
};
export const getEmergencyMasterchefContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, address, masterChef, signer);
};

export const getMulticallContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, getMulticallAddress(chainId), MultiCallAbi, signer);
};

export const getAggregatorContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, getAggregatorAddress(chainId), aggregatorAbi, signer);
};

export const getBrewlabsAggregationRouterContract = (
  chainId: ChainId,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, getBrewlabsAggregationRouterAddress(chainId), brewlabsAggregationRouter, signer);
};

export const getZapInContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, getZapperAddress(chainId), zapperAbi, signer);
};

export const getExternalMasterChefContract = (
  chainId: ChainId,
  appId: AppId,
  chef = Chef.MASTERCHEF,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(chainId, getExternalMasterChefAddress(appId, chef), externalMasterChefAbi, signer);
};

export const getVerificationContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, getVerificationAddress(chainId), verifictionAbi, signer);
};

export const getPancakeMasterChefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ChainId.BSC_MAINNET, getPancakeMasterChefAddress(), masterChefV2, signer);
};

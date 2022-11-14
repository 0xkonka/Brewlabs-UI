import { ethers } from 'ethers'
import { ChainId } from '@brewlabs/sdk'
import { simpleRpcProvider } from 'utils/providers'
import { brewsToken } from 'config/constants/tokens'

// Addresses
import {
  getMulticallAddress,
  getLpManagerAddress,
  getAggregatorAddress,
  getZapperAddress,
  getVerificationAddress,
  getPancakeMasterChefAddress,
  getExternalMasterChefAddress,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV2 from 'config/abi/masterchefV2.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import singleStaking from 'config/abi/singlestaking.json'
import lockupStaking from 'config/abi/brewlabsLockup.json'
import lpManagerAbi from 'config/abi/brewlabsLiquidityManager.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import aggregatorAbi from 'config/abi/brewlabsAggregator.json'
import zapperAbi from 'config/abi/brewlabsZapInConstructor.json'
import externalMasterChefAbi from 'config/abi/externalMasterchef.json'
import verifictionAbi from 'config/abi/brewlabsFactoryVerification.json'
import { AppId, Chef } from 'config/constants/types'

const getContract = (
  chainId: ChainId,
  abi: any,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  const signerOrProvider = signer ?? simpleRpcProvider(chainId)
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, bep20Abi, address, signer)
}
export const getErc721Contract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, erc721Abi, address, signer)
}
export const getLpContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, lpTokenAbi, address, signer)
}
export const getSouschefContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, sousChef, address, signer)
}
export const getSouschefBnbContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, sousChefBnb, address, signer)
}
export const getSouschefV2Contract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, sousChefV2, address, signer)
}
export const getSingleStakingContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, singleStaking, address, signer)
}
export const getLockupStakingContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, lockupStaking, address, signer)
}
export const getLpManagerContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, lpManagerAbi, getLpManagerAddress(chainId), signer)
}
export const getCakeContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, cakeAbi, brewsToken[chainId].address, signer)
}
export const getMasterchefContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, masterChefV2, address, signer)
}
export const getEmergencyMasterchefContract = (
  chainId: ChainId,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, masterChef, address, signer)
}

export const getMulticallContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, MultiCallAbi, getMulticallAddress(chainId), signer)
}

export const getAggregatorContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, aggregatorAbi, getAggregatorAddress(chainId), signer)
}

export const getZapInContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, zapperAbi, getZapperAddress(chainId), signer)
}

export const getExternalMasterChefContract = (
  chainId: ChainId,
  appId: AppId,
  chef = Chef.MASTERCHEF,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  return getContract(chainId, externalMasterChefAbi, getExternalMasterChefAddress(appId, chef), signer)
}

export const getVerificationContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, verifictionAbi, getVerificationAddress(chainId), signer)
}

export const getPancakeMasterChefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ChainId.BSC_MAINNET, masterChefV2, getPancakeMasterChefAddress(), signer)
}

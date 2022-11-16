import { ethers } from 'ethers'
import { ChainId } from '@brewlabs/sdk'
import { brewsToken } from 'config/constants/tokens'
import { AppId, Chef } from 'config/constants/types'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import aggregatorAbi from 'config/abi/brewlabsAggregator.json'
import verifictionAbi from 'config/abi/brewlabsFactoryVerification.json'
import lockupStaking from 'config/abi/brewlabsLockup.json'
import lpManagerAbi from 'config/abi/brewlabsLiquidityManager.json'
import zapperAbi from 'config/abi/brewlabsZapInConstructor.json'
import externalMasterChefAbi from 'config/abi/externalMasterchef.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import masterChef from 'config/abi/masterchef.json'
import masterChefV2 from 'config/abi/masterchefV2.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import singleStaking from 'config/abi/singlestaking.json'

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
import { provider } from './wagmi'


export const getContract = (
  chainId: ChainId,
  abi: any,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider,
) => {
  const signerOrProvider = signer ?? provider({chainId})
  return new ethers.Contract(address, abi, signerOrProvider)
}
export const getBrewsTokenContract = (chainId: ChainId, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(chainId, bep20Abi, brewsToken[chainId].address, signer)
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

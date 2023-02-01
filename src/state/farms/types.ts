import BigNumber from 'bignumber.js'
import { SerializedFarmConfig } from 'config/constants/types'

export type SerializedBigNumber = string

interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
  reflections: string
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
  reflections: BigNumber
}

export interface DeserializedZapFarmUserData {
  stakedBalance: BigNumber
  earnings: BigNumber
  totalRewards: BigNumber
}

export interface SerializedFarm extends SerializedFarmConfig {
  tokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  totalStaked?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  lpTokenPrice?: BigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  rewardPerBlock?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  depositFee?: string
  withdrawFee?: string
  performanceFee?: string
  userData?: SerializedFarmUserData
}

export interface SerializedFarmsState {
    data: SerializedFarm[]
    prices: any,
    loadArchivedFarmsData: boolean
    userDataLoaded: boolean
  }
  
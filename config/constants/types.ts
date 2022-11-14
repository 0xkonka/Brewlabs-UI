import { ChainId, Currency } from "@brewlabs/sdk";

export interface SerializedToken {
  chainId: ChainId
  isNative: boolean
  isToken: boolean
  address?: string
  decimals: number
  symbol?: string
  name?: string
  projectLink?: string
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
  'LOCKUP' = 'Lockup',
  'LOCKUP_V2' = 'Lockup_V2',
  'MULTI' = 'Multi',
  'MULTI_LOCKUP' = 'Multi_Lockup',
}

export enum Version {
  'V1' = 'V1',
  'V2' = 'V2',
  'V3' = 'V3',
}

export enum AppId {
  PANCAKESWAP = 'pancakeswap',
  APESWAP = 'apeswap',
  KNIGHT = 'knight',
  SUSHISWAP = 'sushiswap',
}

export enum Chef {
  MASTERCHEF,
  MASTERCHEF_V2,
}

interface FarmConfigBaseProps {
  pid: number
  farmId?: number
  poolId?: number
  v1pid?: number
  chainId?: ChainId
  version?: Version
  lpSymbol: string
  lpDecimals?: number
  lpAddress: string
  contractAddress?: string
  multiplier?: string
  isCommunity?: boolean
  lpManager?: string
  enableEmergencyWithdraw?: boolean
  isServiceFee?: boolean
  compound?: boolean
  compoundRelection?: boolean
  unverified?: boolean
  featured?: boolean
  isFinished?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  },
  externalSwap?: string
}

export interface SerializedFarmConfig extends FarmConfigBaseProps {
  apr?: number,
  token: SerializedToken
  quoteToken: SerializedToken
  earningToken?: SerializedToken
  reflectionToken?: SerializedToken
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  token: Currency
  quoteToken: Currency
  earningToken?: Currency
  reflectionToken?: Currency
}

interface PoolConfigBaseProps {
  sousId: number
  chainId: ChainId
  contractAddress: string
  poolCategory: PoolCategory
  tokenPerBlock: string
  sortOrder?: number
  version?: Version
  harvest?: boolean
  noCompound?: boolean
  reflection?: boolean
  noReflectionCompound?: boolean
  lockup?: number
  isServiceFee?: boolean
  isFinished?: boolean
  migration?: boolean
  unverified?: boolean
  featured?: boolean
  enableEmergencyWithdraw?: boolean
  forceEndblock?: number
  headerSuffix?: string
  externalSwap?: string
}

export interface SerializedPoolConfig extends PoolConfigBaseProps {
  earningToken: SerializedToken
  stakingToken: SerializedToken
  reflectionTokens?: SerializedToken[]
}

export interface DeserializedPoolConfig extends PoolConfigBaseProps {
  earningToken: Currency
  stakingToken: Currency
  reflectionTokens?: Currency[]
}

export type PageMeta = {
  title: string;
  description?: string;
  image?: string;
};

export type NetworkConfig = {
  id: ChainId;
  name: string;
  image: string;
};

type LinkOfTextAndLink = string | { text: string; url: string }
type DeviceLink = {
  desktop?: LinkOfTextAndLink
  mobile?: LinkOfTextAndLink
}
type LinkOfDevice = string | DeviceLink

export type WalletConfig<T = unknown> = {
  id: string
  title: string
  description: string
  icon: string
  connectorId: T
  deepLink?: string
  installed?: boolean
  guide?: LinkOfDevice
  downloadLink?: LinkOfDevice
  mobileOnly?: boolean
  qrCode?: () => Promise<string>
}

import { JSBI, Percent } from '@brewlabs/sdk'
import { getAddress } from '@ethersproject/address'

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export const truncateHash = (hash: string) => {
  if (!hash) return "here";
  const len = hash.length;
  return `${hash.substr(0, 6)}...${hash.substr(len - 4, len - 1)}`;
};

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}
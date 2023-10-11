import { Currency, NATIVE_CURRENCIES, Token } from "@brewlabs/sdk";
import { SerializedToken } from "config/constants/types";
import { parseUnits } from "viem";

export function serializeToken(token: Currency | any): SerializedToken {
  return {
    chainId: token.chainId,
    isNative: token.isNative,
    isToken: token.isToken,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    projectLink: token.projectLink,
    logo: token.logo,
  };
}

export function deserializeToken(serializedToken: SerializedToken): Currency {
  if (serializedToken?.isNative || !serializedToken?.address) {
    return NATIVE_CURRENCIES[serializedToken.chainId];
  }

  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
    serializedToken.projectLink,
    serializedToken.logo
  );
}

export enum GAS_PRICE {
  default = "3",
  fast = "5",
  instant = "7",
  testnet = "10",
}

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.default, 9).toString(),
  fast: parseUnits(GAS_PRICE.fast, 9).toString(),
  instant: parseUnits(GAS_PRICE.instant, 9).toString(),
  testnet: parseUnits(GAS_PRICE.testnet, 9).toString(),
};

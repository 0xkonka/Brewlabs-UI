import { deserializeToken } from "state/user/hooks/helpers";
import { BIG_ZERO } from "utils/bigNumber";
import { DeserializedIndex, SerializedIndex } from "./types";

export const transformUserData = (userData: any) => {
  return {
    allowance: userData?.allowance ?? false,
    ethBalance: userData?.ethBalance ? BigInt(userData.ethBalance) : BIG_ZERO,
    indexNftItems: userData?.indexNftItems ?? [],
    deployerNftItem: userData?.deployerNftItem,
    stakedBalances: userData?.stakedBalances ? userData.stakedBalances.map((amount) => BigInt(amount)) : [],
    stakedUsdAmount: userData?.stakedUsdAmount ?? "0",
    histories: userData?.histories ?? [],
  };
};
export const transformIndex = (pool: SerializedIndex): DeserializedIndex => {
  const { tokens, userData, ...rest } = pool;

  const _tokens = [];
  for (let i = 0; i < tokens.length; i++) {
    _tokens.push(deserializeToken(tokens[i]));
  }

  return {
    ...rest,
    tokens: _tokens,
    userData: transformUserData(userData),
  };
};

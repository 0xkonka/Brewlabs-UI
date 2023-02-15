import BigNumber from "bignumber.js";
import { deserializeToken } from "state/user/hooks/helpers";
import { BIG_ZERO } from "utils/bigNumber";
import { DeserializedPool, SerializedPool } from "./types";

type UserData =
  | DeserializedPool["userData"]
  | {
      allowance: number | string;
      stakingTokenBalance: number | string;
      stakedBalance: number | string;
      lockedBalance: number | string;
      pendingReward: number | string;
      pendingReflections: number[] | string[];
    };

export const transformUserData = (userData: UserData) => {
  const pendingReflections = [];
  for (let i = 0; i < userData?.pendingReflections?.length; i++) {
    pendingReflections.push(
      userData?.pendingReflections?.[i] ? new BigNumber(userData.pendingReflections[i]) : BIG_ZERO
    );
  }

  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    lockedBalance: userData ? new BigNumber(userData.lockedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
    pendingReflections,
  };
};

export const transformPool = (pool: SerializedPool): DeserializedPool => {
  const { totalStaked, stakingLimit, userData, stakingToken, earningToken, reflection, reflectionTokens, ...rest } =
    pool;

  const _reflectionTokens = [];
  for (let i = 0; i < reflectionTokens.length; i++) {
    _reflectionTokens.push(deserializeToken(reflectionTokens[i]));
  }

  return {
    ...rest,
    reflection,
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    reflectionTokens: _reflectionTokens,
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    performanceFee: pool.performanceFee,
  };
};

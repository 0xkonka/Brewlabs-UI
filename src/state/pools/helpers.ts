import BigNumber from "bignumber.js";
import { SerializedDeposit } from "state/types";
import { deserializeToken } from "state/user/hooks/helpers";
import { DeserializedPool, SerializedPool } from "./types";

type UserData =
  | DeserializedPool["userData"]
  | {
      allowance: number | string;
      stakingTokenBalance: number | string;
      stakedBalance: number | string;
      lockedBalance: number | string;
      earnings: number | string;
      reflections: number[] | string[];
      deposits: SerializedDeposit[];
    };

export const transformUserData = (userData: UserData) => {
  const reflections = [];
  for (let i = 0; i < userData?.reflections?.length; i++) {
    reflections.push(userData?.reflections?.[i] ? new BigNumber(userData.reflections[i]) : new BigNumber(0));
  }
  const deposits = [];
  for (let i = 0; i < userData?.deposits?.length; i++) {
    deposits.push({
      ...userData.deposits[i],
      amount: new BigNumber(userData.deposits[i].amount.toString()),
    });
  }

  return {
    allowance: userData?.allowance ? new BigNumber(userData.allowance) :  new BigNumber(0),
    stakingTokenBalance: userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) :  new BigNumber(0),
    stakedBalance: userData?.stakedBalance ? new BigNumber(userData.stakedBalance) :  new BigNumber(0),
    lockedBalance: userData?.lockedBalance ? new BigNumber(userData.lockedBalance) :  new BigNumber(0),
    earnings: userData?.earnings ? new BigNumber(userData.earnings) :  new BigNumber(0),
    reflections,
    deposits,
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

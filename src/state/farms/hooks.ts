import BigNumber from "bignumber.js";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useSWRImmutable from "swr/immutable";

import { SLOW_INTERVAL } from "config/constants";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenPrice from "hooks/useTokenPrice";
import { useAppDispatch } from "state";
import { deserializeToken } from "state/user/hooks/helpers";
import { BIG_ZERO } from "utils/bigNumber";

import {
  fetchFarmsPublicDataFromApiAsync,
  fetchFarmsTotalStakesAsync,
  fetchFarmsUserDepositDataAsync,
  fetchFarmUserDataAsync,
} from ".";
import { DeserializedFarm, DeserializedFarmUserData, SerializedFarm } from "./types";
import { DeserializedDeposit, DeserializedFarmsState, SerializedDeposit, State } from "../types";

export const usePollFarmsPublicDataFromApi = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataFromApiAsync());
  }, [dispatch]);
};

export const usePollFarmsPublicData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();

  useEffect(() => {
    dispatch(fetchFarmsTotalStakesAsync(chainId));
  }, [dispatch, chainId]);
};

export const usePollFarmsWithUserData = () => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: farms } = useFarms();

  useSWRImmutable(
    chainId ? ["publicFarmData", chainId] : null,
    async () => {
      dispatch(fetchFarmsTotalStakesAsync(chainId));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );

  useSWRImmutable(
    account && chainId ? ["farmsWithUserData", account, chainId] : null,
    async () => {
      const pids = farms.map((farmToFetch) => farmToFetch.pid && farmToFetch.chainId === chainId);
      const params = { account, pids, chainId };

      dispatch(fetchFarmUserDataAsync(params));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );

  useSWRImmutable(
    account ? ["farmsWithUserDepositData", account] : null,
    async () => {
      const pids = farms.map((farmToFetch) => farmToFetch.pid);
      const params = { account, pids };

      dispatch(fetchFarmsUserDepositDataAsync(params));
    },
    {
      refreshInterval: SLOW_INTERVAL,
    }
  );
};

const deserializedDeposit = (deposit: SerializedDeposit): DeserializedDeposit => {
  return {
    ...deposit,
    amount: new BigNumber(deposit.amount),
  };
};

const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
    reflections: farm.userData ? new BigNumber(farm.userData.reflections) : BIG_ZERO,
    deposits: farm.userData.deposits.map(deserializedDeposit),
  };
};

export const deserializeFarm = (farm: SerializedFarm): DeserializedFarm => {
  const {
    apr,
    lpAddress,
    contractAddress,
    lpSymbol,
    lpDecimals,
    pid,
    type,
    farmId,
    poolId,
    chainId,
    dual,
    multiplier,
    isCommunity,
    lpManager,
    compound,
    compoundRelection,
    unverified,
    featured,
    isFinished,
  } = farm;

  return {
    apr,
    lpAddress,
    contractAddress,
    lpSymbol,
    lpDecimals,
    pid,
    type,
    farmId,
    poolId,
    chainId,
    dual,
    multiplier,
    isCommunity,
    lpManager,
    compound,
    compoundRelection,
    unverified,
    featured,
    isFinished,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    earningToken: farm.earningToken ? deserializeToken(farm.earningToken) : undefined,
    reflectionToken: farm.reflectionToken ? deserializeToken(farm.reflectionToken) : undefined,
    userData: deserializeFarmUserData(farm),
    totalStaked: farm.totalStaked ? new BigNumber(farm.totalStaked) : BIG_ZERO,
    poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : BIG_ZERO,
    depositFee: farm.depositFee,
    withdrawFee: farm.withdrawFee,
    version: farm.version,
    performanceFee: farm.performanceFee,
    rewardPerBlock: farm.rewardPerBlock ? new BigNumber(farm.rewardPerBlock) : BIG_ZERO,
    enableEmergencyWithdraw: farm.enableEmergencyWithdraw,
    externalSwap: farm.externalSwap,
    TVLData: farm.TVLData,
    performanceFees: farm.performanceFees,
    stakedAddresses: farm.stakedAddresses
  };
};

export const useFarms = (): DeserializedFarmsState => {
  const farms = useSelector((state: State) => state.farms);
  const deserializedFarmsData = farms.data.map(deserializeFarm);
  const { userDataLoaded } = farms;

  return {
    userDataLoaded,
    data: deserializedFarmsData,
  };
};

export const useFarmFromPid = (pid: number): DeserializedFarm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid));
  return deserializeFarm(farm);
};

export const useFarmFromFarmIdAndPoolId = (farmId: number, poolId: number): DeserializedFarm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.farmId === farmId && f.poolId === poolId));
  return deserializeFarm(farm);
};

export const useFarmFromLpSymbol = (lpSymbol: string): DeserializedFarm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol));
  return deserializeFarm(farm);
};

export const useLpTokenPrice = (lpSymbol: string) => {
  const farm = useFarmFromLpSymbol(lpSymbol);
  const lpPrice = useTokenPrice(farm.chainId, farm.lpAddress, true);
  return lpPrice;
};

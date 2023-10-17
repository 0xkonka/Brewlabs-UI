import { useEffect, useMemo, useState } from "react";
import { JSBI, Token } from "@brewlabs/sdk";
import { Address, useAccount } from "wagmi";

import BrewlabsFeeManagerAbi from "config/abi/swap/brewlabsFeeManager";
import { filterTokens } from "@components/searchModal/filtering";
import { useTokens } from "@hooks/Tokens";
import { useActiveChainId } from "@hooks/useActiveChainId";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { useTokenBalancesWithLoadingIndicator } from "state/wallet/hooks";
import { useSingleContractMultipleData } from "state/multicall/hooks";
import { useTokenMarketChart } from "state/prices/hooks";
import { defaultMarketData } from "state/prices/types";
import { getBrewlabsFeeManagerAddress } from "utils/addressHelpers";

import { rewardInUSD } from "views/swap/components/SwapRewards";
import { usePendingRewards } from "./usePendingRewards";

type FeeDistribution = {
  lpFee: bigint;
  brewlabsFee: bigint;
  tokenOwnerFee: bigint;
  stakingFee: bigint;
  referralFee: bigint;
};

type PoolFeeInfoOutput = {
  token0: Address;
  token1: Address;
  tokenOwner: Address;
  referrer: Address;
  feeDistribution: FeeDistribution;
  timeToOpen: number;
};

export const useLiquidityPools = () => {
  const { chainId } = useActiveWeb3React();
  const contract = useBrewlabsFeeManager(chainId);

  const [pairsLength, setPairsLength] = useState<number>(0);

  useEffect(() => {
    if (contract.address) {
      (async () => {
        try {
          const value = await contract.read.pairsLength([]);
          setPairsLength(+value.toString());
        } catch (e) {}
      })();
    }
  }, [contract.address, chainId]);

  const outputOfPairs = useSingleContractMultipleData({
    contract: useMemo(
      () => ({
        abi: BrewlabsFeeManagerAbi,
        address: getBrewlabsFeeManagerAddress(chainId) as Address,
      }),
      [chainId]
    ),
    functionName: "pairs",
    args: useMemo(() => [...Array(pairsLength).keys()].map((i) => [BigInt(i)] as const), [pairsLength]),
  });

  const pairs = outputOfPairs.filter((data) => data.result).map((data) => data.result[0]);
  const outputOfPools = useSingleContractMultipleData({
    contract: useMemo(
      () => ({
        abi: BrewlabsFeeManagerAbi,
        address: getBrewlabsFeeManagerAddress(chainId) as Address,
      }),
      [chainId]
    ),
    functionName: "getPoolFeeInfo",
    args: useMemo(() => pairs.map((pair) => [pair as Address] as const), [pairs]),
  });

  const pools: PoolFeeInfoOutput[] = outputOfPools.map((data) => ({
    token0: data.result[0],
    token1: data.result[1],
    tokenOwner: data.result[2],
    referrer: data.result[3],
    feeDistribution: data.result[4],
    timeToOpen: 0,
  }));

  return pools
    .map((pool, index) => ({ value: pool, key: index }))
    .filter(({ value, key }) => value)
    .map(({ value, key }) => ({ ...value, id: pairs[key] }));
};

export const useOwnedLiquidityPools = () => {
  const { address: account } = useAccount();
  // const account = "0xe1f1dd010bbc2860f81c8f90ea4e38db949bb16f";

  const { chainId } = useActiveChainId();
  const pairs = useLiquidityPools();

  const lpTokens = useMemo(() => pairs.map((pair) => new Token(chainId, pair.id, 18)), [chainId, pairs]);
  const [lpBalances] = useTokenBalancesWithLoadingIndicator(account, lpTokens);
  const tokenMarketData = useTokenMarketChart(chainId);

  const ownedPairs = useMemo(() => {
    if (!account || !pairs || !pairs.length) return [];
    return pairs.filter(
      (pair) =>
        pair.referrer === account || pair.tokenOwner === account || lpBalances[pair.id]?.greaterThan(JSBI.BigInt(0))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pairs]);

  const rewards = usePendingRewards(ownedPairs);

  const pairTokenAddresses = useMemo(
    () => [...new Set([].concat.apply([], ownedPairs.map((pair) => [pair.token0, pair.token1]) as ConcatArray<any>[]))],
    [ownedPairs]
  );
  const pairTokens = useTokens(pairTokenAddresses);

  const inputFilter = (pair) =>
    filterTokens([new Token(chainId, pair.token0, 18), new Token(chainId, pair.token1, 18)], "").length > 0;

  const eligiblePairs = useMemo(() => ownedPairs.filter(inputFilter), [ownedPairs]);

  const collectiblePairs = useMemo(
    () =>
      eligiblePairs.filter((pair) => {
        if (Object.keys(pairTokens ?? {}).length === 0) return 0;
        const { token0, token1 } = pair;
        const { usd: token0Price } = tokenMarketData[token0?.toLowerCase()] || defaultMarketData;
        const { usd: token1Price } = tokenMarketData[token1?.toLowerCase()] || defaultMarketData;
        return rewardInUSD(pairTokens[token0], pairTokens[token1], token0Price, token1Price, rewards[pair.id]);
      }),
    [eligiblePairs, rewards]
  );

  return { eligiblePairs, ownedPairs, lpBalances, collectiblePairs, rewards, pairTokens };
};

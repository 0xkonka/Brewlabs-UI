import { useCallback, useEffect, useMemo, useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { Address, useAccount } from "wagmi";
import { useSingleContractMultipleData } from "state/multicall/hooks";
import { JSBI, Token } from "@brewlabs/sdk";
import { filterTokens } from "@components/searchModal/filtering";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useTokenBalancesWithLoadingIndicator } from "state/wallet/hooks";
import { usePendingRewards } from "./usePendingRewards";
import { rewardInUSD } from "views/swap/components/SwapRewards";
import { useTokens } from "@hooks/Tokens";
import { useFetchMarketData, useTokenMarketChart } from "state/prices/hooks";
import { defaultMarketData } from "state/prices/types";

type FeeDistribution = {
  lpFee: number;
  brewlabsFee: number;
  tokenOwnerFee: number;
  stakingFee: number;
  referralFEe: number;
};

type PoolFeeInfoOutput = {
  token0: Address;
  token1: Address;
  tokenOwner: Address;
  referrer: Address;
  feeDistribution: FeeDistribution;
};

export const useLiquidityPools = () => {
  const { chainId } = useActiveWeb3React();
  const contract = useBrewlabsFeeManager(chainId);

  const [counter, setCounter] = useState(0);
  const [pairsLength, setPairsLength] = useState<number>(0);
  const [pools, setPools] = useState<any>([]);

  useEffect(() => {
    if (contract.address) {
      (async () => {
        try {
          const value = await contract.pairsLength();
          setPairsLength(value.toNumber());
        } catch (e) {}
      })();
    }
  }, [contract.address, chainId, counter]);

  const outputOfPairs = useSingleContractMultipleData(
    contract,
    "pairs",
    [...Array(pairsLength).keys()].map((i) => [i])
  );

  const pairs = outputOfPairs.filter((data) => data.result).map((data) => data.result[0]);
  const outputOfPools = useSingleContractMultipleData(
    contract,
    "getPoolFeeInfo",
    pairs.map((pair) => [pair])
  );

  const _pools: PoolFeeInfoOutput[] = outputOfPools.map((data) => ({
    token0: data.result?.token0,
    token1: data.result?.token1,
    tokenOwner: data.result?.tokenOwner,
    referrer: data.result?.referer,
    feeDistribution: data.result?.feeDistribution,
  }));

  const fetchData = async (pair) => {
    try {
      const data = await contract.getPoolFeeInfo(pair);
      const index = pools.findIndex((pool) => pool.id === pair);
      if (index < 0) return;

      let _pools = pools;
      _pools[index] = {
        id: pair,
        token0: data.token0,
        token1: data.token1,
        tokenOwner: data.tokenOwner,
        referrer: data.referer,
        feeDistribution: data.feeDistribution,
      };
      setPools(_pools);
    } catch (e) {}
  };

  useEffect(() => {
    const setData = (data) => {
      setPools(data);
    };

    if (pairsLength && _pools.length > 0) {
      setData(
        _pools
          .map((pool, index) => ({ value: pool, key: index }))
          .filter(({ value, key }) => value)
          .map(({ value, key }) => ({ ...value, id: pairs[key] }))
      );
    } else {
      setData([]);
    }
  }, [pairsLength, _pools.length]);

  return {
    pools,
    fetchData,
    fetchAllData: () => {
      setCounter(counter + 1);
    },
  };
};

export const useOwnedLiquidityPools = () => {
  const { address: account } = useAccount();
  // const account = "0xe1f1dd010bbc2860f81c8f90ea4e38db949bb16f";

  const { chainId } = useActiveChainId();
  const { pools: pairs } = useLiquidityPools();

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
    pair.token0 && filterTokens([new Token(chainId, pair.token0, 18), new Token(chainId, pair.token1, 18)], "").length > 0;

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

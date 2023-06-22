import { useCallback, useEffect, useMemo, useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";
import { Address, useAccount } from "wagmi";
import { useSingleContractMultipleData } from "state/multicall/hooks";
import { JSBI, Token } from "@brewlabs/sdk";
import { filterTokens } from "@components/searchModal/filtering";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useTokenBalancesWithLoadingIndicator } from "state/wallet/hooks";

type FeeDistribution = {
  lpFee: number;
  brewlabsFee: number;
  tokenOwnerFee: number;
  stakingFee: number;
  referralFEe: number;
};

type PoolFeInfoOutput = {
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
    if (contract) {
      (async () => {
        const value = await contract.pairsLength();
        setPairsLength(value.toNumber());
      })();
    }
  }, [contract]);

  const outputOfPairs = useSingleContractMultipleData(
    contract,
    "pairs",
    [...Array(pairsLength).keys()].map((i) => [i])
  );

  const pairs = outputOfPairs.filter((data) => data.result).map((data) => data.result[0]);

  const outputOfPools = useSingleContractMultipleData(
    contract,
    "getPoolFeInfo",
    pairs.map((pair) => [pair])
  );

  const pools: PoolFeInfoOutput[] = outputOfPools.map((data) => data.result?.[0]);

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

  const ownedPairs = useMemo(() => {
    if (!account || !pairs || !pairs.length) return [];
    return pairs.filter(
      (pair) =>
        pair.referrer === account || pair.tokenOwner === account || lpBalances[pair.id]?.greaterThan(JSBI.BigInt(0))
    );
  }, [account, pairs]);

  const inputFilter = (pair) =>
    filterTokens([new Token(chainId, pair.token0, 18), new Token(chainId, pair.token1, 18)], "").length > 0;

  const eligiblePairs = useMemo(() => ownedPairs.filter(inputFilter), [ownedPairs]);
  return { eligiblePairs, ownedPairs, lpBalances };
};

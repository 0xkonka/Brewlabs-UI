import { useMemo } from "react";
import { TokenAmount, Pair, Currency, ChainId } from "@brewlabs/sdk";
import { Pair as V2Pair, Token as V2Token, TokenAmount as V2TokenAmount } from "@sushiswap-core/sdk";
import { Interface } from "@ethersproject/abi";

import BrewlabsPairABI from "config/abi/brewlabsPair.json";
import { useMultipleContractSingleData } from "../state/multicall/hooks";
import { wrappedCurrency } from "../utils/wrappedCurrency";
import { useActiveChainId } from "./useActiveChainId";
import { getBrewlabsFeeManagerContract, getBrewlabsPairContract } from "utils/contractHelpers";
import { getAddress } from "ethers/lib/utils.js";

const PAIR_INTERFACE = new Interface(BrewlabsPairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  currencies: [Currency | undefined, Currency | undefined][],
  isExternal?: boolean,
  dexId?: string
): [PairState, Pair | null][] {
  const { chainId } = useActiveChainId();

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies]
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        // if (chainId.toString() !== ChainId.BSC_MAINNET.toString()) return undefined
        return tokenA && tokenB && !tokenA.equals(tokenB)
          ? chainId === ChainId.ETHEREUM && isExternal
            ? V2Pair.getAddress(tokenA as unknown as V2Token, tokenB as unknown as V2Token)
            : Pair.getAddress(tokenA, tokenB, dexId)
          : undefined;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, chainId]
  );

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, "getReserves");

  return useMemo(() => {
    return results.map((result, i) => {
      // if (chainId.toString() !== ChainId.BSC_MAINNET.toString()) return [PairState.INVALID, null]
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const [reserve0, reserve1] = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        chainId === ChainId.ETHEREUM && isExternal
          ? (new V2Pair(
              new V2TokenAmount(token0 as unknown as V2Token, reserve0.toString()),
              new V2TokenAmount(token1 as unknown as V2Token, reserve1.toString())
            ) as unknown as Pair)
          : new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()), dexId),
      ];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, tokens, chainId]);
}

export function usePair(tokenA?: Currency, tokenB?: Currency, isExternal?: boolean, dexId?: string) {
  return usePairs([[tokenA, tokenB]], isExternal, dexId)[0];
}

export async function getPairOwner(address: string, chainId: ChainId, token0: Currency, token1: Currency, pair: Pair) {
  try {
    const feeManagerContract = getBrewlabsFeeManagerContract(chainId);
    const feeMangerOwner = await feeManagerContract.owner();
    let tokenOwner = undefined;
    let stakingPool = undefined;
    if (pair) {
      tokenOwner = await feeManagerContract.getTokenOwner(pair.liquidityToken.address);
      const pairContract = getBrewlabsPairContract(chainId, pair.liquidityToken.address);
      stakingPool = await pairContract.stakingPool();
    }

    const isOwner =
      getAddress(address) === getAddress(feeMangerOwner) || getAddress(address) === getAddress(tokenOwner);

    return {
      owner: feeMangerOwner,
      tokenOwner,
      stakingPool,
      isOwner,
    };
  } catch (e) {
    console.log(e);
    return {};
  }
}

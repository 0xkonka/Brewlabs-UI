import { useMemo } from "react";
import { TokenAmount, Pair, Currency, ChainId } from "@brewlabs/sdk";
import { Pair as V2Pair, Token as V2Token, TokenAmount as V2TokenAmount } from "@sushiswap-core/sdk";
import { Address, zeroAddress } from "viem";

import BrewlabsPairABI from "config/abi/brewlabsPair";
import BrewlabsABI from "config/abi/brewlabs";
import { useMultipleContractSingleData } from "state/multicall/hooks";
import { getBrewlabsFeeManagerContract, getContract } from "utils/contractHelpers";
import { wrappedCurrency } from "utils/wrappedCurrency";

import { useActiveChainId } from "./useActiveChainId";

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
            ? (V2Pair.getAddress(tokenA as unknown as V2Token, tokenB as unknown as V2Token) as Address)
            : (Pair.getAddress(tokenA, tokenB, dexId) as Address)
          : undefined;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, chainId]
  );

  const results = useMultipleContractSingleData({
    addresses: pairAddresses,
    abi: BrewlabsPairABI,
    functionName: "getReserves",
  });

  return useMemo(() => {
    return results.map((result, i) => {
      // if (chainId.toString() !== ChainId.BSC_MAINNET.toString()) return [PairState.INVALID, null]
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const [reserve0, reserve1]: any = reserves;
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
    const feeMangerOwner: any = await feeManagerContract.read.owner([]);
    if (pair) {
      const tokenOwner: any = await feeManagerContract.read.getTokenOwner([pair.liquidityToken.address]);
      if (tokenOwner !== zeroAddress && tokenOwner.toLowerCase() === address.toLowerCase()) return true;
    }
    if (address.toLowerCase() === feeMangerOwner.toLowerCase()) return true;

    if (!token0.isNative)
      try {
        const tokenContract = getContract(chainId, token0.address, BrewlabsABI);
        const owner: any = await tokenContract.read.owner([]);
        if (owner.toLowerCase() === address.toLowerCase()) return true;
      } catch (e) {}

    if (!token1.isNative)
      try {
        const tokenContract = getContract(chainId, token1.address, BrewlabsABI);
        const owner: any = await tokenContract.read.owner([]);
        if (owner.toLowerCase() === address.toLowerCase()) return true;
      } catch (e) {}

    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

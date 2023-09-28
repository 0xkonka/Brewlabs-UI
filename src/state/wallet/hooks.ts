import axios from "axios";
import { ChainId, Currency, CurrencyAmount, JSBI, NATIVE_CURRENCIES, Token, TokenAmount } from "@brewlabs/sdk";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import ERC20_INTERFACE from "config/abi/erc20";
import { EXPLORER_API_KEYS } from "config/constants/networks";
import { EXPLORER_API_URLS } from "config/constants/networks";
import { useAllTokens } from "hooks/Tokens";
import { useMulticallContract } from "hooks/useContract";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useFastRefreshEffect } from "@hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { State } from "state/types";
import { useTokenMarketChart } from "state/prices/hooks";
import { isAddress } from "utils";

import { useSingleContractMultipleData, useMultipleContractSingleData } from "../multicall/hooks";
import { fetchNFTBalancesAsync, fetchTokenBalancesAsync } from ".";
import { SerializedWalletNFT, SerializedWalletToken } from "./type";
import { tokens } from "config/constants/tokens";
import { SUPPORTED_LPs } from "config/constants/swap";

/**
 * Returns a map of the given addresses to their eventually consistent BNB balances.
 */
export function useNativeBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount | undefined;
} {
  const { chainId } = useActiveWeb3React();
  const multicallContract = useMulticallContract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== "")
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value) memo[address] = new CurrencyAmount(NATIVE_CURRENCIES[chainId], JSBI.BigInt(value.toString()));
        return memo;
      }, {}),
    [addresses, results, chainId]
  );
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== "") ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens]);

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, "balanceOf", [address]);

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances]);

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);
  const containsBNB: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies]);
  const ethBalance = useNativeBalances(containsBNB ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (currency instanceof Token) return tokenBalances[currency.address];
        if (currency.isNative) return ethBalance[account];
        return undefined;
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  );
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0];
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens]);
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}

export async function isVerified(curreny?: any) {
  if (curreny?.isNative) return true;
  const result = await axios.get(
    `${EXPLORER_API_URLS[curreny.chainId]}?module=contract&action=getabi&address=${curreny.address}&apikey=${
      EXPLORER_API_KEYS[curreny.chainId]
    }`
  );
  return result.data.message === "OK";
}

export const useFetchNFTBalance = (account, chainIds: ChainId[]) => {
  const dispatch = useAppDispatch();

  const stringifiedChainId = JSON.stringify(chainIds);

  useFastRefreshEffect(() => {
    chainIds.map((chainId) => dispatch(fetchNFTBalancesAsync(account, chainId)));
  }, [dispatch, account, stringifiedChainId]);
};

export const useFetchTokenBalance = (account, chainId: ChainId, signer) => {
  const dispatch = useAppDispatch();
  const tokenMarketData = useTokenMarketChart(chainId);

  const stringifiedData = JSON.stringify({
    dispatch: JSON.stringify(dispatch),
    account,
    chainId,
    tokenMarketData: JSON.stringify(tokenMarketData),
  });

  useFastRefreshEffect(() => {
    if (!account) return;
    dispatch(fetchTokenBalancesAsync(account, chainId, tokenMarketData, signer));
  }, [stringifiedData]);
};

export const useUserNFTData = (chainId: ChainId, account: string): SerializedWalletNFT[] => {
  return useSelector((state: State) => state.wallet.nfts[chainId]?.[account] ?? []);
};

export const useUserTokenData = (chainId: ChainId, account: string): SerializedWalletToken[] => {
  return useSelector((state: State) => state.wallet.tokens[chainId]?.[account] ?? []);
};

export const useUserLpTokenData = (chainId: ChainId, account: string): SerializedWalletToken[] => {
  return useSelector((state: State) => state.wallet.tokens[chainId]?.[account]?.filter((token) => SUPPORTED_LPs[chainId].includes(token.symbol)) ?? []);
};

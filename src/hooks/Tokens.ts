/* eslint-disable no-param-reassign */
import { parseBytes32String } from "@ethersproject/strings";
import { Currency, Token, currencyEquals, NATIVE_CURRENCIES } from "@brewlabs/sdk";
import { useEffect, useMemo, useState } from "react";
import { arrayify } from "ethers/lib/utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import {
  TokenAddressMap,
  useDefaultTokenList,
  useUnsupportedTokenList,
  useCombinedActiveList,
  useCombinedInactiveList,
} from "state/lists/hooks";

import useUserAddedTokens from "state/user/hooks/useUserAddedTokens";
import { isAddress } from "utils";

import { filterTokens } from "components/searchModal/filtering";
import { getBep20Contract } from "utils/contractHelpers";
import { Address, useToken as useToken_ } from "wagmi";

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React();
  const userAddedTokens = useUserAddedTokens();

  return useMemo(() => {
    if (!chainId || Number(chainId) === -1 || !tokenMap[chainId]) return {};

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? []).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token;
        return newMap;
      },
      {}
    );

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap_, token) => {
              tokenMap_[token.address] = token;
              return tokenMap_;
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      );
    }

    return mapWithoutUrls;
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded]);
}

export function useDefaultTokens(): { [address: string]: Token } {
  const defaultList = useDefaultTokenList();
  return useTokensFromMap(defaultList, false);
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList();
  return useTokensFromMap(allTokens, true);
}

export function useAllInactiveTokens(): { [address: string]: Token } {
  // get inactive tokens
  const inactiveTokensMap = useCombinedInactiveList();
  const inactiveTokens = useTokensFromMap(inactiveTokensMap, false);

  // filter out any token that are on active list
  const activeTokensAddresses = Object.keys(useAllTokens());
  const filteredInactive = activeTokensAddresses
    ? Object.keys(inactiveTokens).reduce<{ [address: string]: Token }>((newMap, address) => {
        if (!activeTokensAddresses.includes(address)) {
          newMap[address] = inactiveTokens[address];
        }
        return newMap;
      }, {})
    : inactiveTokens;

  return filteredInactive;
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const unsupportedTokensMap = useUnsupportedTokenList();
  return useTokensFromMap(unsupportedTokensMap, false);
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens();

  if (!activeTokens || !token) {
    return false;
  }

  return !!activeTokens[token.address];
}

// used to detect extra search results
export function useFoundOnInactiveList(searchQuery: string): Token[] | undefined {
  const { chainId } = useActiveWeb3React();
  const inactiveTokens = useAllInactiveTokens();

  return useMemo(() => {
    if (!chainId || searchQuery === "") {
      return undefined;
    }
    const tokens = filterTokens(Object.values(inactiveTokens), searchQuery);
    return tokens;
  }, [chainId, inactiveTokens, searchQuery]);
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens();

  if (!currency) {
    return false;
  }

  return !!userAddedTokens.find((token) => currencyEquals(currency, token));
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React();
  const tokens = useAllTokens();

  const address = isAddress(tokenAddress);

  const token: Token | undefined = address ? tokens[address] : undefined;

  const { data, isLoading } = useToken_({
    address: (address as Address) || undefined,
    chainId,
    enabled: Boolean(!!address && !token),
    // consider longer stale time
  });

  return useMemo(() => {
    if (token) return token;
    if (!chainId || !address) return undefined;
    if (isLoading) return null;
    if (data) {
      return new Token(chainId, data.address, data.decimals, data.symbol ?? "UNKNOWN", data.name ?? "Unknown Token");
    }
    return undefined;
  }, [token, chainId, address, isLoading, data]);
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const { chainId } = useActiveWeb3React();
  const isBNB =
    currencyId?.toUpperCase() === "ETH" ||
    Object.values(NATIVE_CURRENCIES)
      .map((c) => c.symbol)
      .includes(currencyId?.toUpperCase());

  const token = useToken(isBNB ? undefined : currencyId);
  return isBNB ? NATIVE_CURRENCIES[chainId] : token;
}

export function useTokens(tokenAddresses?: string[]): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React();
  const [tokensInfo, setTokensInfo] = useState<{ [address: string]: Token }>();
  useEffect(() => {
    (async () => {
      const tokenEntries = await Promise.all(
        tokenAddresses.map(async (address) => {
          const tokenContract = getBep20Contract(chainId, address);
          const name: any = await tokenContract.read.name([]);
          const symbol: any = await tokenContract.read.symbol([]);
          const decimals = await tokenContract.read.decimals([]);
          return [address, new Token(chainId, address, Number(decimals), symbol, name)];
        })
      );
      setTokensInfo(Object.fromEntries(tokenEntries));
    })();
  }, [JSON.stringify(tokenAddresses), chainId]);

  return tokensInfo;
}

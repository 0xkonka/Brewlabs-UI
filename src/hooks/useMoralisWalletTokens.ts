/**
 * Gets wallet tokens for the current user
 * Tokens + native
 * Uses Moralis and TanStack Query
 * THIS SUCCEEDS src\hooks\useWalletTokens.ts - USE THIS INSTEAD
 */

import { useQuery } from "@tanstack/react-query";

export type WalletTokensFromMoralis = {
  balance: string;
  decimals: number;
  logo: string | null;
  name: string;
  percentage_relative_to_total_supply: number;
  possible_spam: boolean;
  symbol: string;
  thumbnail: string | null;
  token_address: string;
  total_supply: string;
  total_supply_formatted: string;
  verified_contract: boolean;
};

const fetchWalletTokens = async ({ address, chain }) => {
  const res = await fetch("/api/moralis/evmApi/getWalletTokenBalances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, chain }),
  });

  return res.json();
};

// Filter out the spam, non-verified tokens and zero balances
const filterWalletTokens = (walletTokens: WalletTokensFromMoralis[]) =>
  walletTokens.filter((i) => !i.possible_spam && Number(i.balance) > 0 && i.verified_contract);

export const useMoralisWalletTokens = ({ walletAddress, chainId }) => {
  // Get the wallet tokens from Moralis + React Query
  const {
    data: walletTokens,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    select: filterWalletTokens,
    refetchOnWindowFocus: false,
    queryKey: [`userWalletTokens_${walletAddress}`],
    queryFn: (): Promise<WalletTokensFromMoralis[]> => fetchWalletTokens({ address: walletAddress, chain: chainId }),
  });

  return { walletTokens, isLoading, isFetching, isError };
};

/**
 * DEPRECATION NOTICE
 * USE THIS INSTEAD - src\hooks\useMoralisWalletTokens.ts
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

type WalletCurrency = {
  balance: string;
  decimals: number;
  logo: string;
  name: string;
  percentage_relative_to_total_supply: number;
  possible_spam: boolean;
  symbol: string;
  thumbnail: string;
  token_address: string;
  total_supply: string;
  total_supply_formatted: string;
  verified_contract: boolean;
};

const useWalletTokens = (walletAddress: string, chain: string) => {
  const [tokens, setTokens] = useState<WalletCurrency[]>();

  const fetchTokens = useCallback(async () => {
    if (!chain || !walletAddress) {
      setTokens([]);
      return;
    }

    const res = await axios.get(`https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=${chain}`, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "Dtn7MAUqnS4GXJBGinl4TiW4d5IzYzuZRCkN4nhHkLMo9ysx2MJuPUVcGpMn1x6S",
        Accept: "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
    setTokens(res.data);
  }, [walletAddress, chain]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return tokens;
};

export default useWalletTokens;

import { useEffect, useState } from "react";
import { ChainId, WNATIVE } from "@brewlabs/sdk";
import axios from "axios";
import { getAddress } from "ethers/lib/utils.js";
import { useAccount, useSigner } from "wagmi";

import { ERC20_ABI } from "config/abi/erc20";
import LpTokenAbi from "config/abi/lpToken.json";

import { useActiveChainId } from "hooks/useActiveChainId";
import { getNativeSybmol } from "lib/bridge/helpers";
import { useUserLpTokenData } from "state/wallet/hooks";
import multicall from "utils/multicall";
import { useAppDispatch } from "state";
import { fetchTokenBalancesAsync } from "state/wallet";
import { useTokenMarketChart } from "state/prices/hooks";
import { DEXSCREENER_CHAINNAME } from "config";
import { API_URL } from "config/constants";

export const useLPTokens = () => {
  const dispatch = useAppDispatch();

  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();
  const { data: signer } = useSigner();

  const ownedlpTokens = useUserLpTokenData(chainId, account);
  const tokenMarketData = useTokenMarketChart(chainId);

  const [lpTokens, setLPTokens] = useState(null);

  async function fetchLPInfo(data: any, chainId: ChainId) {
    const pairInfos = await Promise.all(
      data.map(async (data) => {
        try {
          let pair;
          if (data.symbol === "BREWSWAP-LP") {
            const brewSwapUrl = `${API_URL}/chart/search/pairs?q=${data.address}`;
            const { data: brewPairs } = await axios.get(brewSwapUrl);
            if (!brewPairs || !brewPairs.length) return null;
            pair = brewPairs[0];
            pair = {
              ...pair,
              liquidity: { ...pair.liquidity, quote: pair.liquidity.usd / (pair.totalSupply ?? 1) },
            };
          } else {
            const url = `https://io.dexscreener.com/dex/search/pairs?q=${data.address}&s=2`;
            const { data: response } = await axios.post(`https://pein-api.vercel.app/api/tokenController/getHTML`, {
              url,
            });
            if (!response.result.pairs.length) return null;

            pair = response.result.pairs[0];
            const calls = [
              {
                name: "decimals",
                address: pair.baseToken.address,
              },
              {
                name: "decimals",
                address: pair.quoteToken.address,
              },
            ];
            const result = await multicall(ERC20_ABI, calls, chainId);
            pair = {
              ...pair,
              baseToken: { ...pair.baseToken, decimals: result[0][0] },
              quoteToken: { ...pair.quoteToken, decimals: result[1][0] },
            };
          }

          return {
            timeStamp: Math.floor(pair.pairCreatedAt / 1000),
            address: getAddress(data.address),
            balance: data.balance,
            symbol: data.symbol,
            token0: pair.baseToken,
            token1: pair.quoteToken,
            price: pair.liquidity.quote,
            volume: pair.volume.h24 ?? 0,
            chainId,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      })
    );
    return pairInfos.filter((pair) => pair);
  }

  async function fetchLPTokens(chainId) {
    dispatch(fetchTokenBalancesAsync(account, chainId, tokenMarketData, signer));
  }

  useEffect(() => {
    if (!account) {
      setLPTokens(null);
      return;
    }
    if (!Object.keys(DEXSCREENER_CHAINNAME).includes(chainId.toString())) {
      setLPTokens(null);
      return;
    }

    if (!ownedlpTokens.length) {
      setLPTokens(null);
      return;
    }

    const fetchLPInfoAsync = async () => {
      const data = await fetchLPInfo(ownedlpTokens, chainId);
      setLPTokens(data);
    };

    fetchLPInfoAsync();
  }, [account, chainId, JSON.stringify(ownedlpTokens)]);

  return { lpTokens: lpTokens ?? [], loading: ownedlpTokens.length && lpTokens === null, fetchLPTokens };
};

import { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import axios from "axios";
import { getAddress } from "ethers/lib/utils.js";

import { ERC20_ABI } from "config/abi/erc20";

import { DEXSCREENER_CHAINNAME, GECKO_CHAINNAME } from "config";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useAppDispatch } from "state";
import { useTokenMarketChart } from "state/prices/hooks";
import { fetchTokenBalancesAsync } from "state/wallet";
import { useUserLpTokenData } from "state/wallet/hooks";
import multicall from "utils/multicall";
import { useSigner } from "utils/wagmi";
import { useAccount } from "wagmi";
import { API_URL } from "config/constants";
import { ethers } from "ethers";
import { analyzePairLog } from "utils/getChartTransactions";

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
          let lpTokenInfo, pair;
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
            // const url = `https://api.dexscreener.com/latest/dex/pairs/${DEXSCREENER_CHAINNAME[chainId]}/${data.address}`;
            const url = `https://api.geckoterminal.com/api/v2/networks/${GECKO_CHAINNAME[chainId]}/pools/${data.address}`;
            
            const { data: response } = await axios.get(url);
            lpTokenInfo = response.data.attributes
            pair = response.data.relationships;

            const token0Addr = pair.base_token.data.id.replace(`${GECKO_CHAINNAME[chainId]}_`, "")
            const token1Addr = pair.quote_token.data.id.replace(`${GECKO_CHAINNAME[chainId]}_`, "")

            const calls = [
              {
                name: "decimals",
                address: token0Addr,
              },
              {
                name: "decimals",
                address: token1Addr,
              },
              {
                name: "totalSupply",
                address: data.address,
              },
            ];
            const result = await multicall(ERC20_ABI, calls, chainId);
            pair = {
              baseToken: { address: token0Addr, decimals: result[0][0] },
              quoteToken: { address: token1Addr, decimals: result[1][0] },
              totalSupply: ethers.utils.formatEther(result[2][0]).toString(),
              a: pair.dex.data.id,
            };
          }
          return {
            timeStamp: Math.floor((new Date(lpTokenInfo.pool_created_at).getTime()) / 1000),
            address: getAddress(data.address),
            balance: data.balance,
            symbol: lpTokenInfo.name,
            token0: pair.baseToken,
            token1: pair.quoteToken,
            price: lpTokenInfo.reserve_in_usd / pair.totalSupply,
            volume: Number(lpTokenInfo.volume_usd.h24) ?? 0,
            chainId,
            a: pair.a.includes("pancakeswap") ? "pcs-v2" : pair.a.includes("uniswap") ? "uniswap-v2" : pair.a,
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

import { useEffect, useState } from "react";
import { ChainId, WNATIVE } from "@brewlabs/sdk";
import axios from "axios";
import { Address, getAddress } from "viem";
import { erc20ABI, useAccount } from "wagmi";

import LpTokenAbi from "config/abi/brewlabsPair";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getNativeSybmol } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { useTokenMarketChart } from "state/prices/hooks";
import { fetchTokenBalancesAsync } from "state/wallet";
import { useUserLpTokenData } from "state/wallet/hooks";
import { getViemClients } from "utils/viem";

const DEX_GURU_CHAINIDS = {
  [ChainId.ETHEREUM]: "eth",
  [ChainId.BSC_MAINNET]: "bsc",
  [ChainId.FANTOM]: "fantom",
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.AVALANCHE]: "avalanche",
};

export const useLPTokens = () => {
  const dispatch = useAppDispatch();

  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();

  const ownedlpTokens = useUserLpTokenData(chainId, account);
  const tokenMarketData = useTokenMarketChart(chainId);

  const [lpTokens, setLPTokens] = useState([]);

  async function fetchLPInfo(data: any, chainId: ChainId) {
    const client = getViemClients({ chainId });
    const pairInfos = await Promise.all(
      data.map(async (data) => {
        if (!DEX_GURU_CHAINIDS[chainId]) {
          let calls: any = [
            { abi: LpTokenAbi, functionName: "token0", address: data.address as Address },
            { abi: LpTokenAbi, functionName: "token1", address: data.address as Address },
          ];
          const [token0, token1] = await client.multicall({ contracts: calls });

          calls = [
            { abi: erc20ABI, functionName: "name", address: token0.result as Address },
            { abi: erc20ABI, functionName: "symbol", address: token0.result as Address },
            { abi: erc20ABI, functionName: "decimals", address: token0.result as Address },
            { abi: erc20ABI, functionName: "name", address: token1.result as Address },
            { abi: erc20ABI, functionName: "symbol", address: token1.result as Address },
            { abi: erc20ABI, functionName: "decimals", address: token1.result as Address },
          ];
          const result = await client.multicall({ contracts: calls });

          return {
            timeStamp: 0,
            address: getAddress(data.address),
            balance: data.balance,
            symbol: data.symbol,
            token0: {
              address: getAddress(token0.result.toString()),
              name: result[0].result,
              symbol: result[1].result,
              decimals: result[2].result,
            },
            token1: {
              address: getAddress(token1.result.toString()),
              name: result[3].result,
              symbol: result[4].result,
              decimals: result[5].result,
            },
            price: 0,
            volume: 0,
            chainId,
          };
        }

        const result = await axios.post("https://api.dex.guru/v3/tokens", {
          ids: [`${data.address}-${DEX_GURU_CHAINIDS[chainId]}`],
          limit: 1,
          network: DEX_GURU_CHAINIDS[chainId],
        });

        const addresses = result.data.data[0].underlyingAddresses;
        let info = {
          pool_address: data.address,
          order: "desc",
          limit: 15,
          offset: 1,
          sort_by: "timestamp",
          token_status: "all",
          transaction_types: ["mint", "burn"],
          with_full_totals: false,
        };
        const response = await Promise.all([
          axios.post("https://api.dex.guru/v3/tokens", {
            ids: [`${addresses[0]}-${DEX_GURU_CHAINIDS[chainId]}`, `${addresses[1]}-${DEX_GURU_CHAINIDS[chainId]}`],
            limit: 2,
            network: DEX_GURU_CHAINIDS[chainId],
          }),
          axios.post("https://api.dex.guru/v3/tokens/transactions/count", info),
        ]);
        const priceResult = response[0];

        // const txCount = response[1].data.count;
        // info.offset = 15 * Math.floor(txCount / 15);
        let lastTx: any = await axios.post("https://api.dex.guru/v3/tokens/transactions", info);
        const token0 = priceResult.data.data[0];
        let token1 = priceResult.data.data[1];
        if (token0.address == token1.address) {
          token1 = WNATIVE[chainId];
          token1.symbol = getNativeSybmol(chainId);
        }
        const lpInfo = result.data.data[0];
        lastTx = lastTx.data.data;
        return {
          timeStamp: lastTx.length ? lastTx[lastTx.length - 1].timestamp : 0,
          address: getAddress(data.address),
          balance: data.balance,
          symbol: data.symbol,
          token0: {
            decimals: token0.decimals,
            symbol: token0.symbols[0],
            address: getAddress(token0.address),
            name: token0.name,
          },
          token1: {
            decimals: token1.decimals,
            symbol: token1.symbols?.[0] ?? token1.symbol,
            address: getAddress(token1.address),
            name: token1.name,
          },
          price: lpInfo.priceUSD,
          volume: lpInfo.volume24hUSD,
          chainId,
        };
      })
    );
    return pairInfos;
  }

  async function fetchLPTokens(chainId) {
    dispatch(fetchTokenBalancesAsync(account, chainId, tokenMarketData));
    // if (chainId === 1) {
    //   try {
    //     const result1 = await axios.get(`https://api.blockchain.info/v2/eth/data/account/${account}/tokens`);
    //     const nonZeroBalances = result1.data.tokenAccounts.filter(
    //       (data: any) => data.balance / 1 > 0 && SUPPORTED_LPs[ChainId.ETHEREUM].includes(data.tokenSymbol)
    //     );
    //     const addresses = nonZeroBalances.map((data) => {
    //       return {
    //         address: data.tokenHash,
    //         balance: data.balance / Math.pow(10, data.decimals),
    //         symbol: data.tokenSymbol,
    //       };
    //     });
    //     const info = await fetchLPInfo(addresses, "eth");
    //     setETHLPTokens(info);
    //   } catch (e) {
    //     console.log(e);
    //     setETHLPTokens([]);
    //   }
    // } else if (chainId === 56) {
    //   try {
    //     let tokenBalances: any = await axios.post(`${API_URL}/html/getTokenBalances`, {
    //       address: account,
    //       chainId,
    //     });
    //     tokenBalances = tokenBalances.data;
    //     let _lps = tokenBalances.filter((data) => SUPPORTED_LPs[ChainId.BSC_MAINNET].includes(data.symbol));
    //     console.log("_lps", _lps);
    //     _lps = await fetchLPInfo(_lps, "bsc");
    //     setBSCLpTokens(_lps);
    //   } catch (e) {
    //     console.log(e);
    //     setBSCLpTokens([]);
    //   }
    // }
  }

  useEffect(() => {
    if (!account) {
      setLPTokens([]);
      return;
    }

    const fetchLPInfoAsync = async () => {
      const data = await fetchLPInfo(ownedlpTokens, chainId);
      setLPTokens(data);
    };

    fetchLPInfoAsync();
  }, [account, chainId, JSON.stringify(ownedlpTokens)]);

  return { lpTokens, loading: ownedlpTokens.length !== lpTokens.length, fetchLPTokens };
};

import { ethers } from "ethers";

import { useFastRefreshEffect, useSlowRefreshEffect } from "./useRefreshEffect";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { EXPLORER_API_KEYS, EXPLORER_API_URLS } from "config/constants/networks";
import brewlabsABI from "config/abi/brewlabs.json";
import multicall from "utils/multicall";
import { getContract } from "utils/contractHelpers";
import { isAddress } from "ethers/lib/utils.js";
import { API_URL } from "config/constants";
import { CommunityContext } from "contexts/CommunityContext";
import { isVerified } from "state/wallet/hooks";
import { BASE_URL, DEXTOOLS_CHAINNAME, DEX_GURU_CHAIN_NAME } from "config";
import { simpleRpcProvider } from "utils/providers";

function useTokenInfo(address: string, chainId: number) {
  const [owner, setOwner] = useState("");
  const [deployer, setDeployer] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);

  async function fetchInfo() {
    try {
      const calls = [
        {
          name: "name",
          address: address,
        },
        {
          name: "symbol",
          address: address,
        },
        {
          name: "decimals",
          address: address,
        },
      ];
      const tokenContract = getContract(chainId, address, brewlabsABI);

      axios
        .get(
          `${EXPLORER_API_URLS[chainId]}?module=account&action=tokentx&contractaddress=${address}&address=${ethers.constants.AddressZero}&page=1&offset=1&apikey=${EXPLORER_API_KEYS[chainId]}`
        )
        .then((result) => {
          setDeployer(result.data.result[0]?.to);
        })
        .catch((e) => console.log(e));

      multicall(brewlabsABI, calls, chainId)
        .then((result) => {
          setName(result[0][0]);
          setSymbol(result[1][0]);
          setDecimals(result[2][0] / 1);
        })
        .catch((e) => console.log(e));

      tokenContract
        .totalSupply()
        .then((data) => setTotalSupply(data))
        .catch((e) => console.log(e));

      tokenContract
        .owner()
        .then((data) => setOwner(data))
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  }

  useSlowRefreshEffect(() => {
    if (!ethers.utils.isAddress(address)) {
      setOwner("");
      setDeployer("");
      return;
    }
    fetchInfo();
  }, [address, chainId]);
  return { owner, deployer, totalSupply, name, symbol, decimals };
}

export function useTokenMarketInfos(chainId: number, address: string, pair: string) {
  const [infos, setInfos] = useState({});
  const { communities }: any = useContext(CommunityContext);
  const isExisitngCommunity = communities.find((community) =>
    Object.keys(community.currencies).find(
      (key, i) => community.currencies[key].address.toLowerCase() === address.toLowerCase()
    )
  );
  const community = isExisitngCommunity ? `${BASE_URL}/communities/${isExisitngCommunity.pid}` : "";

  async function fetchInfos() {
    try {
      const result = await Promise.all([
        axios.post(`${API_URL}/chart/getDexData`, {
          url: `https://api.dextools.io/v1/token?chain=${DEXTOOLS_CHAINNAME[chainId]}&address=${address}&page=1&pageSize=5`,
        }),
        axios.post(`https://api.dex.guru/v3/pools/`, {
          id: `${address}-${DEX_GURU_CHAIN_NAME[chainId]}`,
          limit: 1000,
          network: DEX_GURU_CHAIN_NAME[chainId],
          order: "desc",
          sort_by: "volume24h_stable",
        }),
        axios.post(`https://api.dex.guru/v3/tokens`, {
          ids: [`${address}-${DEX_GURU_CHAIN_NAME[chainId]}`],
          limit: 1,
        }),
      ]);
      const _token = result[0].data.result;
      const _pool = result[1].data.data.find((pool) => pool.id.replace(`-${chainId}`, "") === pair);
      if (_token.statusCode !== 200) return;
      const tokenInfos = _token.data;
      const priceInfos = result[2].data.data[0];
      setInfos({
        ...tokenInfos,
        liquidity: _pool.liquidityStable,
        holders: tokenInfos.metrics.holders,
        marketCap: tokenInfos.metrics.totalSupply * priceInfos.priceUSD,
        chainId,
        volume24h: _pool.volume24hStable,
        priceChange: priceInfos.priceUSDChange24h * 100,
        price: priceInfos.priceUSD,
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!isAddress(address) || !isAddress(pair)) {
      setInfos({});
      return;
    }
    fetchInfos();
  }, [address, chainId, pair]);

  return { infos: { ...infos, community } };
}

export function useTradingHistory(address, chainId, pair, amm, period = 0, limit = 100, type = "all") {
  const [histories, setHistories] = useState([]);

  const stringifiedValue = JSON.stringify({
    address,
    chainId,
    pair,
    amm,
    period,
    limit,
    type,
  });
  async function fetchHistories() {
    try {
      let query: any = {
        amm,
        current_token_id: `${address}-${DEX_GURU_CHAIN_NAME[chainId]}`,
        limit,
        offset: 0,
        order: "desc",
        pool_address: pair,
        sort_by: "timestamp",
        token_status: type,
        transaction_types: ["swap"],
        with_full_totals: true,
      };
      if (period) {
        query = { ...query, date: { start_date: Date.now() - period, end_date: Date.now() } };
      }
      const { data } = await axios.post("https://api.dex.guru/v3/tokens/transactions", query);
      let histories = data.data;
      histories = histories.map((history) => {
        return { ...history, chainId };
      });
      setHistories(histories);
    } catch (e) {
      console.log(e);
    }
  }
  useSlowRefreshEffect(() => {
    if (!isAddress(address)) {
      setHistories([]);
      return;
    }
    fetchHistories();
  }, [stringifiedValue]);

  return { histories };
}

export function useTokenTaxes(address, chainId, pair, amm) {
  const [buyTaxes, setBuyTaxes] = useState(0);
  const [sellTaxes, setSellTaxes] = useState(0);

  const { histories: buyTransaction } = useTradingHistory(address, chainId, pair, amm, 0, 1, "buy");
  const { histories: sellTransaction } = useTradingHistory(address, chainId, pair, amm, 0, 1, "sell");

  const stringifiedValue = JSON.stringify({
    address,
    chainId,
    pair,
    amm,
    buyTransaction,
    sellTransaction,
  });

  async function fetchTaxes() {
    try {
      console.log(buyTransaction);
      if (!buyTransaction || !buyTransaction.length || buyTransaction[0].type !== amm) return;
      console.log(address, chainId, pair, amm);
      console.log(buyTransaction);
      const response = await axios.post("https://api.dex.guru/v3/tokens/transactions", {
        network: "bsc",
        transaction_address: "0x5885a689ac2a2a16914cd432542d1eb4c7c7ee1f17811d24ec1356d11346dab7",
        limit: 1000,
      });
      console.log(response);
      // const provider = simpleRpcProvider(chainId);
      // const { logs } = await provider.getTransactionReceipt(buyTransaction[0].transactionAddress);

      // const log = logs.find((log: any) => {
      //   if (
      //     log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
      //     log.address.toLowerCase() === address.toLowerCase()
      //   )
      //     console.log(
      //       ethers.utils.defaultAbiCoder.decode(["address"], log.topics[2])[0].toLowerCase(),
      //       buyTransaction[0].sender
      //     );
      //   return (
      //     log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
      //     log.address.toLowerCase() === address.toLowerCase() &&
      //     ethers.utils.defaultAbiCoder.decode(["address"], log.topics[2])[0].toLowerCase() === buyTransaction[0].sender
      //   );
      // });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchTaxes();
  }, [stringifiedValue]);

  return { buyTaxes, sellTaxes };
}
export default useTokenInfo;

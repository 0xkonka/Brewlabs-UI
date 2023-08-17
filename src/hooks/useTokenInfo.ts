import { ethers } from "ethers";

import { useSecondRefreshEffect, useSlowRefreshEffect } from "./useRefreshEffect";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { EXPLORER_API_KEYS, EXPLORER_API_URLS } from "config/constants/networks";
import brewlabsABI from "config/abi/brewlabs.json";
import multicall from "utils/multicall";
import { getContract } from "utils/contractHelpers";
import { isAddress } from "ethers/lib/utils.js";
import { API_URL } from "config/constants";
import { CommunityContext } from "contexts/CommunityContext";
import { BASE_URL, DEXTOOLS_CHAINNAME, DEX_GURU_CHAIN_NAME } from "config";

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
          limit: 100,
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

let wrappedAddress;

const defaultVolume = {
  vol: {
    "5m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "30m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "24hr": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "7d": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
  },
  "vol (usd)": {
    "5m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "30m": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "24hr": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
    "7d": {
      Buys: 0,
      Sells: 0,
      Total: 0,
      isUp: true,
    },
  },
};
export function useTradingHistory({
  address,
  chainId,
  pair,
  amm,
  period = 0,
  limit = 0,
  offset = 0,
  status = "all",
  account = null,
}) {
  const [histories, setHistories] = useState([]);
  const [volumeDatas, setVolumeDatas] = useState(defaultVolume);
  const [loading, setLoading] = useState(false);

  const stringifiedValue = JSON.stringify({
    address,
    chainId,
    pair,
    amm,
    period,
    limit,
    offset,
    status,
    account,
  });

  function getVolume(data, period) {
    let buyVolume = 0,
      sellVolume = 0;

    const sellCount = data
      .filter(
        (history) =>
          history.fromAddress === address.toLowerCase() && Number(history.timestamp) >= Date.now() / 1000 - period
      )
      .map((history) => (sellVolume += history.amountStable)).length;

    const buyCount = data
      .filter(
        (history) =>
          history.fromAddress !== address.toLowerCase() && Number(history.timestamp) >= Date.now() / 1000 - period
      )
      .map((history) => (buyVolume += history.amountStable)).length;

    return {
      buyVolume,
      sellVolume,
      buyCount,
      sellCount,
      totalCount: buyCount + sellCount,
      totalVolume: buyVolume + sellVolume,
    };
  }

  async function fetchHistories(query) {
    let histories = [];

    let count = query.limit;
    if (!query.limit) {
      const { data: response } = await axios.post("https://api.dex.guru/v3/tokens/transactions/count", query);
      count = response.count;
    }
    await Promise.all(
      new Array(Math.min(Math.ceil(count / 100), 100)).fill("").map(async (result, i) => {
        query = { ...query, limit: 100, offset: query.offset ? query.offset : 100 * i };
        const { data }: any = await axios.post("https://api.dex.guru/v3/tokens/transactions", query);
        histories = [
          ...histories,
          ...data.data.map((history) => {
            return { ...history, chainId };
          }),
        ];
        return histories;
      })
    );
    if (wrappedAddress === address) {
      const v5m = getVolume(histories, 5 * 60);
      const v30m = getVolume(histories, 30 * 60);
      const v24hr = getVolume(histories, 3600 * 24);
      const v7d = getVolume(histories, 3600 * 24 * 7);
      setVolumeDatas({
        vol: {
          "5m": {
            Buys: v5m.buyCount,
            Sells: v5m.sellCount,
            Total: v5m.totalCount,
            isUp: v5m.buyCount >= v5m.sellCount,
          },
          "30m": {
            Buys: v30m.buyCount,
            Sells: v30m.sellCount,
            Total: v30m.totalCount,
            isUp: v30m.buyCount >= v30m.sellCount,
          },
          "24hr": {
            Buys: v24hr.buyCount,
            Sells: v24hr.sellCount,
            Total: v24hr.totalCount,
            isUp: v24hr.buyCount >= v24hr.sellCount,
          },
          "7d": {
            Buys: v7d.buyCount,
            Sells: v7d.sellCount,
            Total: v7d.totalCount,
            isUp: v7d.buyCount >= v7d.sellCount,
          },
        },
        "vol (usd)": {
          "5m": {
            Buys: v5m.buyVolume,
            Sells: v5m.sellVolume,
            Total: v5m.totalVolume,
            isUp: v5m.buyVolume >= v5m.sellVolume,
          },
          "30m": {
            Buys: v30m.buyVolume,
            Sells: v30m.sellVolume,
            Total: v30m.totalVolume,
            isUp: v30m.buyVolume >= v30m.sellVolume,
          },
          "24hr": {
            Buys: v24hr.buyVolume,
            Sells: v24hr.sellVolume,
            Total: v24hr.totalVolume,
            isUp: v24hr.buyVolume >= v24hr.sellVolume,
          },
          "7d": {
            Buys: v7d.buyVolume,
            Sells: v7d.sellVolume,
            Total: v7d.totalVolume,
            isUp: v7d.buyVolume >= v7d.sellVolume,
          },
        },
      });
      return histories;
    }
    return [];
  }

  useEffect(() => {
    setHistories([]);
    setVolumeDatas(defaultVolume);
    if (!isAddress(address)) {
      return;
    }
    wrappedAddress = address;
    setLoading(true);
    let query: any = {
      amm,
      current_token_id: `${address}-${DEX_GURU_CHAIN_NAME[chainId]}`,
      order: "desc",
      pool_address: pair,
      sort_by: "timestamp",
      token_status: status,
      transaction_types: ["swap"],
      with_full_totals: true,
      limit,
      offset,
    };
    if (period) {
      query = { ...query, date: { start_date: Date.now() - period, end_date: Date.now() } };
    }
    if (account) {
      query = { ...query, account: account.toLowerCase() };
    }
    fetchHistories(query)
      .then((result) => {
        setHistories(result);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [stringifiedValue]);

  useSecondRefreshEffect(() => {
    console.log("SecondRefreshEffect");
    const query: any = {
      amm,
      current_token_id: `${address}-${DEX_GURU_CHAIN_NAME[chainId]}`,
      order: "desc",
      pool_address: pair,
      sort_by: "timestamp",
      token_status: status,
      transaction_types: ["swap"],
      with_full_totals: true,
      limit: 100,
      offset: 0,
    };
    fetchHistories(query)
      .then((result) => {
        let temp = [...histories];
        for (let i = 0; i < result.length; i++) {
          const isExisting = histories.find((history) => history.transactionAddress === result[i].transactionAddress);
          if (!isExisting) {
            temp.push(result[i]);
          }
        }
        setHistories(temp.sort((a, b) => b.timestamp - a.timestamp));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return { histories, volumeDatas, loading };
}

export function useTokenTaxes(address, chainId) {
  const [buyTaxes, setBuyTaxes] = useState(null);
  const [sellTaxes, setSellTaxes] = useState(null);
  async function fetchTaxes() {
    try {
      const { data: response } = await axios.get(`https://api.gopluslabs.io/api/v1/token_security/${chainId}`, {
        params: { contract_addresses: address },
      });
      setBuyTaxes(response.result[address.toLowerCase()].buy_tax * 100);
      setSellTaxes(response.result[address.toLowerCase()].sell_tax * 100);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!isAddress(address)) return;
    fetchTaxes();
  }, [address, chainId]);

  return { buyTaxes, sellTaxes };
}
export default useTokenInfo;

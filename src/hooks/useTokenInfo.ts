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
import { fetchTradingHistories } from "./useTokenAllPairs";

export async function getBaseInfos(address, chainId) {
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
    const result = await multicall(brewlabsABI, calls, chainId);
    return { name: result[0][0], symbol: result[1][0], decimals: result[2][0] / 1 };
  } catch (e) {
    console.log(e);
    return { name: "", symbol: "", decimals: 0 };
  }
}
function useTokenInfo(address: string, chainId: number) {
  const [owner, setOwner] = useState("");
  const [deployer, setDeployer] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);

  async function fetchInfo() {
    try {
      const tokenContract = getContract(chainId, address, brewlabsABI);
      axios
        .get(
          `${EXPLORER_API_URLS[chainId]}?module=account&action=tokentx&contractaddress=${address}&address=${ethers.constants.AddressZero}&page=1&offset=1&apikey=${EXPLORER_API_KEYS[chainId]}`
        )
        .then((result) => {
          setDeployer(result.data.result[0]?.to);
        })
        .catch((e) => console.log(e));

      getBaseInfos(address, chainId)
        .then((result) => {
          setName(result.name);
          setSymbol(result.symbol);
          setDecimals(result.decimals);
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

export async function fetchDexInfos(address, chainId, pair) {
  try {
    const result = await Promise.all([
      axios.post(`${API_URL}/chart/getDexData`, {
        url: `https://api.dextools.io/v1/token?chain=${DEXTOOLS_CHAINNAME[chainId]}&address=${address}&page=1&pageSize=5`,
      }),
      axios.post(`${API_URL}/chart/getDexData`, {
        url: `https://api.dextools.io/v1/pair?chain=${DEXTOOLS_CHAINNAME[chainId]}&address=${pair}`,
      }),
    ]);
    let tokenInfos = { metrics: { holders: 0, totalSupply: 0 } },
      pairInfos: any = { liquidity: 0, price: 0, price24h: 0 };
    if (result[0].data.success) tokenInfos = result[0].data.result.data;
    if (result[1].data.success) {
      const data = result[1].data.result.data;
      pairInfos = {
        liquidity: data.metrics.liquidity,
      };
    }
    return {
      ...tokenInfos,
      ...pairInfos,
      holders: tokenInfos.metrics.holders,
      totalSupply: tokenInfos.metrics.totalSupply,
      chainId,
    };
  } catch (e) {
    console.log(e);
    return {};
  }
}

export function useTokenMarketInfos(currency: any) {
  const [dexInfos, setDexInfos] = useState<any>({});
  const [pairInfos, setPairInfos] = useState<any>({});

  const { communities }: any = useContext(CommunityContext);

  const isExisitngCommunity = communities.find((community) =>
    Object.keys(community.currencies).find(
      (key, i) => community.currencies[key].address.toLowerCase() === currency?.tokenAddresses[0]?.toLowerCase()
    )
  );
  const community = isExisitngCommunity ? `${BASE_URL}/communities/${isExisitngCommunity.pid}` : "";
  const strigifiedCurrency = JSON.stringify(currency && Object.keys(currency).filter((key) => key !== "params"));
  useEffect(() => {
    if (!isAddress(currency?.tokenAddresses[0]) || !isAddress(currency?.address)) {
      setDexInfos({});
      setPairInfos({});
      return;
    }
    fetchDexInfos(currency.tokenAddresses[0], currency.chainId, currency.address)
      .then((result) => {
        setDexInfos(result);
      })
      .catch((e) => console.log(e));

    fetchTradingHistories(
      {
        address: currency.tokenAddresses[0],
        current_token_id: `${currency.tokenAddresses[0]}-${DEX_GURU_CHAIN_NAME[currency.chainId]}`,
        chainId: currency.chainId,
        pool_address: currency.address,
        amm: currency.swap,
        date: { start_date: Date.now() - 3600 * 24 * 2 * 1000, end_date: Date.now() },
        limit: 0,
        offset: 0,
        with_full_totals: true,
        order: "desc",
        token_status: "all",
        transaction_types: ["swap"],
        sort_by: "timestamp",
      },
      currency.chainId
    )
      .then((result) => {
        let volume = 0,
          volume24h = 0;
        const txs = result.filter((tx) => tx.timestamp >= Date.now() / 1000 - 3600 * 24);
        const txs24h = result.filter((tx) => tx.timestamp < Date.now() / 1000 - 3600 * 24);
        txs.map((tx) => (volume += tx.amountStable));
        txs24h.map((tx) => (volume24h += tx.amountStable));
        setPairInfos({
          volume24h: volume,
          volume24hChange: volume ? ((volume - volume24h) / volume) * 100 : 0,
        });
      })
      .catch((e) => console.log(e));
  }, [strigifiedCurrency]);

  return {
    infos: {
      ...dexInfos,
      ...pairInfos,
      community,
      totalSupply: dexInfos.totalSupply ?? 0,
    },
  };
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

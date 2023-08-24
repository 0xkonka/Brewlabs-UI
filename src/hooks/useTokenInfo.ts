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
      (key, i) => community.currencies[key].address.toLowerCase() === address?.toLowerCase()
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
        volume24hChange: priceInfos.volumeUSDChange24h * 100,
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

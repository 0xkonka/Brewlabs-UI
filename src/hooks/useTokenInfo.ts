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
import { BASE_URL, DEXSCREENER_CHAINNAME, DEXTOOLS_CHAINNAME, DEX_GURU_CHAIN_NAME } from "config";
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

export async function fetchDexInfos(token, chainId) {
  try {
    const result = await axios.post(`${API_URL}/chart/getDexData`, {
      url: `https://api.dextools.io/v1/token?chain=${DEXTOOLS_CHAINNAME[chainId]}&address=${token}&page=1&pageSize=5`,
    });
    let tokenInfos = { metrics: { holders: 0, totalSupply: 0 } };
    if (result.data.success) tokenInfos = result.data.result.data;
    return {
      ...tokenInfos,
      holders: tokenInfos.metrics.holders,
      totalSupply: tokenInfos.metrics.totalSupply,
      chainId,
    };
  } catch (e) {
    console.log(e);
    return {};
  }
}

export function useTokenMarketInfos(pair: any) {
  const [dexInfos, setDexInfos] = useState<any>({});
  const [volume24hChange, setVolume24hChange] = useState(0);

  const { communities }: any = useContext(CommunityContext);

  const isExisitngCommunity = communities.find((community) =>
    Object.keys(community.currencies).find(
      (key, i) => community.currencies[key].address.toLowerCase() === pair?.baseToken?.address?.toLowerCase()
    )
  );
  const community = isExisitngCommunity ? `${BASE_URL}/communities/${isExisitngCommunity.pid}` : "";
  const strigifiedCurrency = JSON.stringify(pair);
  useEffect(() => {
    if (!isAddress(pair?.address)) {
      setDexInfos({});
      return;
    }
    fetchDexInfos(pair.baseToken.address, pair.chainId)
      .then((result) => {
        setDexInfos(result);
      })
      .catch((e) => console.log(e));

    const url = `https://io.dexscreener.com/dex/chart/amm/${pair.a}/bars/${DEXSCREENER_CHAINNAME[pair.chainId]}/${
      pair.address
    }?from=${Date.now() - 86400000 * 2}&to=${Date.now()}&res=240&cb=8`;
    console.log(pair);
    axios
      .post(`https://pein-api.vercel.app/api/tokenController/getHTML`, { url })
      .then((result) => {
        const bars = result.data.result.bars;
        const v1 =
          Number(bars[0].volumeUsd) + Number(bars[1].volumeUsd) + Number(bars[2].volumeUsd) + Number(bars[3].volumeUsd);
        const v2 =
          Number(bars[4].volumeUsd) + Number(bars[5].volumeUsd) + Number(bars[6].volumeUsd) + Number(bars[7].volumeUsd);
        console.log(v1, v2);
        setVolume24hChange((v2 ? (v2 - v1) / v2 : 0) * 100);
      })
      .catch((e) => console.log(e));
  }, [strigifiedCurrency]);

  return {
    infos: {
      ...dexInfos,
      volume24hChange,
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

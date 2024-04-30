import { ethers } from "ethers";
import { useSlowRefreshEffect } from "./useRefreshEffect";
import { useEffect, useState } from "react";
import axios from "axios";
import { EXPLORER_API_KEYS, EXPLORER_API_URLS } from "config/constants/networks";
import brewlabsABI from "config/abi/brewlabs.json";
import multicall from "utils/multicall";
import { getContract } from "utils/contractHelpers";
import { isAddress } from "ethers/lib/utils.js";
import { COVALENT_API_KEYS, COVALENT_CHAIN_NAME } from "config";

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

export function useTokenHolders(address, chainId) {
  const [holders30d, setHolders30D] = useState([]);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  async function fetchHolders30d() {
    try {
      const dateString = formatDate(Date.now() - 86400000 * 30);
      const { data: response } = await axios.get(
        `https://api.covalenthq.com/v1/${
          COVALENT_CHAIN_NAME[chainId]
        }/tokens/${address}/token_holders_v2/?page-size=1000&page-number=${0}&date=${dateString}`,
        { headers: { Authorization: `Bearer ${COVALENT_API_KEYS[0]}` } }
      );
      const holders = response.data.items.map((holder) => ({
        ...holder,
        balance: holder.balance / Math.pow(10, holder.contract_decimals),
      }));
      setHolders30D(holders);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    if (!isAddress(address)) return;
    fetchHolders30d();
  }, [address, chainId]);
  return { holders30d };
}
export default useTokenInfo;

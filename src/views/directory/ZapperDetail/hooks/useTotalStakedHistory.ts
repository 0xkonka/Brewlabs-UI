import { useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import axios from "axios";
import { decodeFunctionData, parseAbi, zeroAddress } from "viem";

import { EXPLORER_API_URLS, EXPLORER_API_KEYS } from "config/constants/networks";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { getExternalMasterChefAddress } from "utils/addressHelpers";

const useTotalStakedHistory = (data) => {
  const [history, setHistory] = useState([]);
  const { appId, lpAddress, chainId, pid } = data;

  async function fetchPrice(address, chainId) {
    const to = Math.floor(Date.now() / 1000);
    const result = await axios.get(
      `https://api.dex.guru/v1/tradingview/history?symbol=${
        address === zeroAddress ? WNATIVE[chainId].address : address
      }-${chainId === 56 ? "bsc" : "eth"}_USD&resolution=10&from=${to - 3600 * 24}&to=${to}`
    );
    return result.data.c[result.data.c.length - 1];
  }
  async function fetchHistory() {
    try {
      const url = `${EXPLORER_API_URLS[chainId]}?module=account&action=txlist&address=${getExternalMasterChefAddress(
        appId
      )}&apikey=${EXPLORER_API_KEYS[chainId]}`;
      let result: any = await axios.get(url);
      if (result.data.message === "NOTOK") return;
      result = result.data.result;
      let _deposits = [],
        _withdraws = [],
        _history = [],
        amount = 0,
        fee = 0;
      for (let i = 0; i < result.length; i++) {
        if (result[i].functionName.includes("zapIn")) {
          const abi = parseAbi([
            "function zapIn(address _FromTokenContractAddress,address _pairAddress,uint256 _pid,uint256 _amount,uint256 _minPoolTokens,address _rewardAddress)",
          ]);
          const decodeResult = decodeFunctionData({ abi, data: result[i].input });
          if (Number(decodeResult.args["._pid"]) === pid) {
            _deposits.push({
              amount: Number(decodeResult.args["_amount"]) / Math.pow(10, 18),
              address: decodeResult.args["_FromTokenContractAddress"],
            });
          }
        }
        if (result[i].functionName.includes("zapOut")) {
          const abi = parseAbi(["function zapOut(uint256 _pid,uint256 _amount,address _reward)"]);
          const decodeResult = decodeFunctionData({ abi, data: result[i].input });
          if (Number(decodeResult.args["._pid"]) === pid)
            _withdraws.push({ amount: Number(decodeResult.args["_amount"]) / Math.pow(10, 18) });
        }
      }
      let depositCalls = [];
      for (let i = 0; i < _deposits.length; i++) {
        if (!depositCalls.includes(_deposits[i].address)) depositCalls.push(_deposits[i].address);
      }
      const prices = await Promise.all([
        ...depositCalls.map(async (data) => {
          const result = await fetchPrice(data, chainId);
          return { address: data, result };
        }),
        fetchPrice(lpAddress, chainId),
      ]);
      for (let i = 0; i < _deposits.length; i++) {
        const filteredPrice = prices.filter((data) => data.address === _deposits[i].address);
        amount += _deposits[i].amount * filteredPrice[0].result;
        _history.push(amount);
      }
      for (let i = 0; i < _withdraws.length; i++) {
        amount -= _withdraws[i].amount * prices[prices.length - 1];
        _history.push(amount);
      }
      setHistory(_history.length ? _history : [0, 0, 0, 0, 0, 0]);
    } catch (e) {
      console.log(e);
    }
  }
  useSlowRefreshEffect(() => {
    fetchHistory();
  }, [lpAddress]);
  return { history };
};

export default useTotalStakedHistory;

import axios from "axios";
import { getMulticallContract } from "utils/contractHelpers";
import { fetchTokenBaseInfo } from "./fetchFeaturedPrices";
import { ChainId } from "@brewlabs/sdk";
import { UNMARSHAL_API_KEYS } from "config";
import { DEX_GURU_WETH_ADDR } from "config/constants";

async function getNativeBalance(address: string, chainId: number) {
  let ethBalance = 0;
  const multicallContract = getMulticallContract(chainId);
  ethBalance = await multicallContract.getEthBalance(address);
  return ethBalance;
}

export async function fetchTokenBalances(address: string, chainId: number) {
  let data: any = [];
  if (chainId === 1) {
    const result = await axios.get(`https://api.blockchain.info/v2/eth/data/account/${address}/tokens`);
    const nonZeroBalances = result.data.tokenAccounts.filter((data: any) => data.balance / 1 > 0);
    data = await Promise.all(
      nonZeroBalances.map(async (token: any) => {
        const data = await Promise.all([fetchTokenBaseInfo(token.tokenHash, chainId, "name")]);
        return {
          address: token.tokenHash,
          balance: token.balance / Math.pow(10, token.decimals),
          decimals: token.decimals,
          name: data[0][0][0],
          symbol: token.tokenSymbol,
        };
      })
    );
  } else if (chainId === 56) {
    data = await axios.post("https://pein-api.vercel.app/api/tokenController/getTokenBalances", { address, chainId });
    data = data.data;
  } else if (chainId === 137) {
    let offset = 0;
    let tokens = [];
    let apiKeyIndex = 0;
    do {
      const query = new URLSearchParams({
        pageSize: "100",
        auth_key: "K82WDxM7Ej3y9u8VSmLYa8pdeqTVqziA2VGQaSRq",
        offset: offset.toString(),
      }).toString();

      const resp = await fetch(`https://api.unmarshal.com/v2/matic/address/${address}/assets?${query}`, {
        method: "GET",
      });
      if (resp.status === 429) {
        apiKeyIndex++;
        if (apiKeyIndex === UNMARSHAL_API_KEYS.length) break;
        continue;
      }
      const data = await resp.json();
      offset = data.next_offset;
      tokens = [...tokens, ...data.assets];
      if (!offset) break;
    } while (1);
    data = tokens.map((token) => {
      return {
        address:
          token.contract_address === "0x0000000000000000000000000000000000001010"
            ? DEX_GURU_WETH_ADDR
            : token.contract_address,
        balance: token.balance / Math.pow(10, token.contract_decimals),
        decimals: token.contract_decimals,
        name: token.contract_name,
        symbol: token.contract_ticker_symbol,
      };
    });
  }
  if (chainId === ChainId.ETHEREUM || chainId === ChainId.BSC_MAINNET) {
    const ethBalance = await getNativeBalance(address, chainId);
    data.push({
      address: DEX_GURU_WETH_ADDR,
      balance: ethBalance / Math.pow(10, 18),
      decimals: 18,
      name: chainId === 1 ? "Ethereum" : "Binance",
      symbol: chainId === 1 ? "ETH" : "BNB",
    });
  }
  return data;
}

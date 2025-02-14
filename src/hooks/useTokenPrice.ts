import { useContext, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import axios from "axios";
import { DEXTOOLS_CHAINNAME, DEX_GURU_CHAIN_NAME } from "config";
import { useSlowRefreshEffect } from "./useRefreshEffect";
import { API_URL, GURU_API_KEY } from "config/constants";
import { isAddress } from "utils";

export const useTokenPrices = () => {
  const { tokenPrices } = useContext(TokenPriceContext);
  return tokenPrices;
};

const useTokenPrice = (chainId: ChainId, address: string | undefined, isLiquidity = false) => {
  const { tokenPrices, lpPrices } = useContext(TokenPriceContext);

  if (isLiquidity) {
    return lpPrices[`c${chainId}_l${address?.toLowerCase()}`] ? +lpPrices[`c${chainId}_l${address?.toLowerCase()}`] : 0;
  }
  return tokenPrices[`c${chainId}_t${address?.toLowerCase()}`]
    ? +tokenPrices[`c${chainId}_t${address?.toLowerCase()}`]
    : 0;
};

export async function fetchDexGuruPrice(chainId: number, address: string) {
  try {
    if (!isAddress(address)) return 0;

    // const { status, data: response } = await axios.post(`${API_URL}/chart/getDexData`, {
    //   url: `https://api.dextools.io/v1/token?chain=${DEXTOOLS_CHAINNAME[chainId]}&address=${address}&page=1&pageSize=5`,
    // });

    // if (status !== 200) return 0;
    // if (response.success === false) return 0;

    // return response.result.data.reprPair.price;
    
    const { data : response } = await axios.get(`https://api.dev.dex.guru/v1/chain/${chainId}/tokens/${address}/market?api-key=${GURU_API_KEY}`)

    return response.price_usd;

  } catch (e) {
    console.log(e, address, chainId);
    return 0;
  }
}
export const useDexPrice = (chainId: number, address: string) => {
  const [price, setPrice] = useState(null);

  useSlowRefreshEffect(() => {
    fetchDexGuruPrice(chainId, address).then((result) => setPrice(result));
  }, [chainId, address]);

  return { price };
};

export default useTokenPrice;

import { useContext, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import axios from "axios";
import { DEX_GURU_CHAIN_NAME } from "config";
import { useSlowRefreshEffect } from "./useRefreshEffect";

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
    const { data: response } = await axios.post("https://api.dex.guru/v3/tokens", {
      ids: [`${address}-${DEX_GURU_CHAIN_NAME[chainId]}`],
      limit: 1,
      network: DEX_GURU_CHAIN_NAME[chainId],
    });
    return response.data[0].priceUSD;
  } catch (e) {
    console.log(e);
    return 0;
  }
}
export const useDexPrice = (chainId: number, address: string) => {
  const [price, setPrice] = useState(null);

  useSlowRefreshEffect(() => {
    fetchDexGuruPrice(chainId, address)
      .then((result) => setPrice(result))
      .catch((e) => console.log(e));
  }, [chainId, address]);

  return { price };
};

export default useTokenPrice;

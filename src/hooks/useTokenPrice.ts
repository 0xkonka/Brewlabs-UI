import { useContext } from "react";
import { ChainId } from "@brewlabs/sdk";
import { TokenPriceContext } from "contexts/TokenPriceContext";

export const useTokenPrices = () => {
  const { tokenPrices } = useContext(TokenPriceContext);
  return tokenPrices;
};

const useTokenPrice = (chainId: ChainId, address: string | undefined, isLiquidity = false) => {
  const { tokenPrices, lpPrices } = useContext(TokenPriceContext);
  if (isLiquidity) {
    return +lpPrices[`c${chainId}_l${address?.toLowerCase()}`] ?? 0;
  }
  return +tokenPrices[`c${chainId}_t${address?.toLowerCase()}`] ?? 0;
};

export default useTokenPrice;

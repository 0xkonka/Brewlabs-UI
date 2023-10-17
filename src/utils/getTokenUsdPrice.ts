import { Address, formatUnits } from "viem";
import apePriceGetterABI from "config/abi/apePriceGetter";
import { getApePriceGetterAddress, getNativeWrappedAddress } from "./addressHelpers";
import { getViemClients } from "./viem";

export const getTokenUsdPrice = async (
  chainId: number,
  tokenAddress: string,
  tokenDecimal: number,
  lp?: boolean,
  isNative?: boolean
) => {
  const client = getViemClients({ chainId });

  const priceGetterAddress = getApePriceGetterAddress(chainId);
  const nativeTokenAddress = getNativeWrappedAddress(chainId);
  if (!priceGetterAddress) return 0;
  if ((tokenAddress || isNative) && tokenDecimal) {
    const call: any = lp
      ? {
          address: priceGetterAddress as Address,
          abi: apePriceGetterABI,
          functionName: "getLPPrice",
          args: [tokenAddress, 18],
        }
      : {
          address: priceGetterAddress as Address,
          abi: apePriceGetterABI,
          functionName: "getPrice",
          args: [isNative ? nativeTokenAddress : tokenAddress, tokenDecimal],
        };

    const tokenPrice = await client.readContract(call);
    const filterPrice = +formatUnits(tokenPrice[0], tokenDecimal);
    return filterPrice;
  }
  return null;
};

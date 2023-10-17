import { Address, formatEther } from "viem";

import apePriceGetterABI from "config/abi/apePriceGetter";
import { Farm } from "state/types";
import { getApePriceGetterAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

const fetchLpPrices = async (chainId, farmsConfig: Farm[]) => {
  const client = getViemClients({ chainId });

  const apePriceGetterAddress = getApePriceGetterAddress(chainId);
  const tokensToCall = Object.keys(farmsConfig).filter(
    (token) => farmsConfig[token].lpAddresses[chainId] !== undefined
  );
  const calls = tokensToCall.map((token) => {
    return {
      address: apePriceGetterAddress as Address,
      abi: apePriceGetterABI,
      functionName: "getLPPrice",
      args: [farmsConfig[token].lpAddresses[chainId], 18],
    };
  });
  const tokenPrices = await client.multicall({ contracts: calls });
  const mappedTokenPrices = tokensToCall.map((token, i) => {
    return {
      pid: farmsConfig[token].pid,
      address: farmsConfig[token].lpAddresses,
      symbol: farmsConfig[token].lpSymbol,
      price: +formatEther(tokenPrices[i].result as bigint),
      decimals: 18,
    };
  });
  return mappedTokenPrices;
};

export default fetchLpPrices;

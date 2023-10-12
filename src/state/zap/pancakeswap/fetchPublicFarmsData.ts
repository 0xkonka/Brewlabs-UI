import { ChainId } from "@brewlabs/sdk";
import { chunk } from "lodash";
import { erc20ABI } from "wagmi";

import { getPancakeMasterChefAddress as getMasterChefAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

const fetchFarmCalls = (farm) => {
  const { lpAddress, token, quoteToken } = farm;

  return [
    {
      address: token.address,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [lpAddress],
    },
    {
      address: quoteToken.address,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [lpAddress],
    },
    {
      address: lpAddress,
      abi: erc20ABI,
      functionName: "balanceOf",
      args: [getMasterChefAddress()],
    },
    {
      address: lpAddress,
      abi: erc20ABI,
      functionName: "totalSupply",
    },
    {
      address: token.address,
      abi: erc20ABI,
      functionName: "decimals",
    },
    {
      address: quoteToken.address,
      abi: erc20ABI,
      functionName: "decimals",
    },
  ];
};

export const fetchPublicFarmsData = async (farms): Promise<any[]> => {
  const client = getViemClients({ chainId: ChainId.BSC_MAINNET });

  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm));
  const chunkSize = farmCalls.length / farms.length;
  const farmMultiCallResult = await client.multicall({ contracts: farmCalls });
  return chunk(farmMultiCallResult, chunkSize);
};

import { useState } from "react";
import { Address, formatEther, isAddress } from "viem";
import { erc20ABI } from "wagmi";

import lpTokenAbi from "config/abi/brewlabsPair";
import { getViemClients } from "utils/viem";

import { useSlowRefreshEffect } from "./useRefreshEffect";

function useLPTokenInfo(address: string, chainId: number) {
  const [pair, setPair] = useState(null);
  const [pending, setPending] = useState(false);

  async function fetchInfo() {
    setPending(true);
    try {
      const client = getViemClients({ chainId });
      const calls = [
        { address: address as Address, abi: lpTokenAbi, functionName: "token0" },
        { address: address as Address, abi: lpTokenAbi, functionName: "token1" },
        { address: address as Address, abi: lpTokenAbi, functionName: "totalSupply" },
        { address: address as Address, abi: lpTokenAbi, functionName: "factory" },
      ];
      const result = await client.multicall({ contracts: calls });

      const tokenInfos = await client.multicall({
        contracts: [
          { address: result[0].result as Address, abi: erc20ABI, functionName: "name" },
          { address: result[0].result as Address, abi: erc20ABI, functionName: "symbol" },
          { address: result[0].result as Address, abi: erc20ABI, functionName: "decimals" },
          { address: result[1].result as Address, abi: erc20ABI, functionName: "name" },
          { address: result[1].result as Address, abi: erc20ABI, functionName: "symbol" },
          { address: result[1].result as Address, abi: erc20ABI, functionName: "decimals" },
        ],
      });

      let data = {
        chainId,
        address,
        token0: {
          address: result[0].result,
          name: tokenInfos[0].result,
          symbol: tokenInfos[1].result,
          decimals: Number(tokenInfos[2].result),
        },
        token1: {
          address: result[1].result,
          name: tokenInfos[3].result,
          symbol: tokenInfos[4].result,
          decimals: Number(tokenInfos[5].result),
        },
        totalSupply: formatEther(result[2].result as bigint),
        factory: result[3].result,
      };
      setPair(data);
    } catch (e) {
      setPair(null);
      console.log(e);
    }
    setPending(false);
  }

  useSlowRefreshEffect(() => {
    if (!isAddress(address)) {
      setPair(null);
      return;
    }
    fetchInfo();
  }, [address]);
  return { pair, pending };
}

export default useLPTokenInfo;

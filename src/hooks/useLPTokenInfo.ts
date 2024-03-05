import { useMemo, useState } from "react";
import { ethers } from "ethers";

import erc20Abi from "config/abi/erc20.json";
import lpTokenAbi from "config/abi/lpToken.json";
import multicall from "utils/multicall";

import { setLpInfo } from "state/deploy/deployerFarm.store";

import { useBigSlowRefreshEffect } from "./useRefreshEffect";

type PairDataType = {
  chainId: number;
  address: string;
  factory: string;
  token0: {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
  };
  token1: {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
  };
} | null;

export type LpInfoType = {
  pending: boolean;
  pair: PairDataType;
};

function useLPTokenInfo(address: string, chainId: number): { pair: PairDataType; pending: boolean } {
  const [pair, setPair] = useState(null);
  const [pending, setPending] = useState(false);

  async function fetchInfo() {
    setPending(true);
    try {
      const calls = [
        {
          address,
          name: "token0",
        },
        {
          address,
          name: "token1",
        },
        {
          address,
          name: "totalSupply",
        },
        {
          address,
          name: "factory",
        },
      ];
      const result = await multicall(lpTokenAbi, calls, chainId);

      const tokenInfos = await multicall(
        erc20Abi,
        [
          {
            address: result[0][0],
            name: "name",
          },
          {
            address: result[0][0],
            name: "symbol",
          },
          {
            address: result[0][0],
            name: "decimals",
          },
          {
            address: result[1][0],
            name: "name",
          },
          {
            address: result[1][0],
            name: "symbol",
          },
          {
            address: result[1][0],
            name: "decimals",
          },
        ],
        chainId
      );

      let data = {
        chainId,
        address,
        token0: {
          address: result[0][0],
          name: tokenInfos[0][0],
          symbol: tokenInfos[1][0],
          decimals: tokenInfos[2][0] / 1,
        },
        token1: {
          address: result[1][0],
          name: tokenInfos[3][0],
          symbol: tokenInfos[4][0],
          decimals: tokenInfos[5][0] / 1,
        },
        totalSupply: result[2][0] / Math.pow(10, 18),
        factory: result[3][0],
      } as PairDataType;

      setPair(data);
    } catch (e) {
      setPair(null);
    }
    setPending(false);
  }

  useBigSlowRefreshEffect(() => {
    if (!ethers.utils.isAddress(address)) {
      setPair(null);
      return;
    }
    fetchInfo();
  }, [address]);

  // Set global state store
  useMemo(() => {
    setLpInfo({ pair, pending });
  }, [pair, pending]);

  return { pair, pending };
}

export default useLPTokenInfo;

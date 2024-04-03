import { useState, useEffect } from "react";
import { isAddress } from "viem";

import erc20Abi from "config/abi/erc20.json";
import lpTokenAbi from "config/abi/lpToken.json";
import multicall from "utils/multicall";

import { useTokenList } from "state/home/hooks";

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
  errorMessage: string;
};

function useLPTokenInfo(address: string, chainId: number, routerFactory: `0x${string}`): LpInfoType {
  const [pair, setPair] = useState(null);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supportedTokens = useTokenList(chainId);

  useEffect(() => {
    // Set unsupported if the LP token is not supported
    const determineSupport = (data: PairDataType) => {
      const token0Address = data.token0.address;
      const token1Address = data.token1.address;

      const notSupported =
        routerFactory.toLowerCase() !== data.factory.toLowerCase() ||
        supportedTokens
          .filter((t) => t.chainId === chainId && t.address)
          .filter(
            (t) =>
              t.address.toLowerCase() === token0Address.toLowerCase() ||
              t.address.toLowerCase() === token1Address.toLowerCase()
          ).length < 2;

      if (notSupported) {
        setErrorMessage("Unsupported LP token");
      } else {
        setErrorMessage("");
      }
    };

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
        determineSupport(data);
      } catch (e) {
        setPair(null);
        setErrorMessage("Error fetching LP token info");
      }
      setPending(false);
    }

    if (!address) return;

    if (!isAddress(address)) {
      setPair(null);
      setErrorMessage("Invalid address");
      return;
    }
    fetchInfo();
    setErrorMessage("");
  }, [address, chainId, pair?.pair?.factory, routerFactory, supportedTokens]);

  return { pair, pending, errorMessage };
}

export default useLPTokenInfo;

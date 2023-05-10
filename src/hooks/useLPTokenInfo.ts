import { Currency, CurrencyAmount } from "@brewlabs/sdk";
import { useMemo, useState } from "react";

import { useTokenContract } from "./useContract";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useSlowRefreshEffect } from "./useRefreshEffect";
import axios from "axios";
import { ethers } from "ethers";
import { getBep20Contract } from "utils/contractHelpers";

function useLPTokenInfo(address: string, chainId: number) {
  const [pair, setPair] = useState(null);
  async function fetchInfo() {
    try {
      if (chainId === 1) {
        let result: any = await axios.post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2", {
          query: `{
          pair(id: "${address.toLowerCase()}") {
            id
            totalSupply
            token0 {
              decimals
              name
              symbol
              id
            }
            token1 {
              decimals
              name
              symbol
              id
            }
          }
        }`,
        });
        result = result.data.data.pair;
        setPair({
          address,
          chainId,
          token0: { ...result.token0, address: result.token0.id },
          token1: { ...result.token0, address: result.token1.id },
          totalSupply: result.totalSupply,
        });
      }
      if (chainId === 56) {
        const tokenContract = getBep20Contract(chainId, address);
        let result: any = await Promise.all([
          axios.post("https://api.thegraph.com/subgraphs/name/bluesea321/pancakeswap-pair", {
            query: `{
          pair(id: "${address}") {
            token0 {
              name
              symbol
              decimals
              id
            }
            token1 {
              decimals
              id
              name
              symbol
            }
          }
        }`,
          }),
          tokenContract.totalSupply(),
        ]);
        const pair = result[0].data.data.pair;
        setPair({
          address,
          chainId,
          token0: { ...pair.token0, address: pair.token0.id },
          token1: { ...pair.token1, address: pair.token1.id },
          totalSupply: result[1] / Math.pow(10, 18),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  useSlowRefreshEffect(() => {
    if (!ethers.utils.isAddress(address)) {
      setPair(null);
      return;
    }
    fetchInfo();
  }, [address]);
  return pair;
}

export default useLPTokenInfo;

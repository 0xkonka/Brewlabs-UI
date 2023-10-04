import { ChainId } from "@brewlabs/sdk";
import axios from "axios";
import { COVALENT_API_KEYS, COVALENT_CHAIN_NAME } from "config";
import { isAddress } from "utils";
import { formatIPFSString } from "utils/functions";
export async function getTradingPair(chainId, pair) {
  try {
    const query = `{
      pair(id: "${pair}") {
      id
      token1Price
      token0Price
      swaps {
        id
        token0 {
          derivedUSD
        }
        token1 {
          id
        }
      }
      token1 {
        decimals
        id
        name
        symbol
      }
      token0 {
        decimals
        id
        name
        symbol
      }
    }
    pairDayData(id: "${pair}") {
      id
      dailyVolumeUSD
    }
  }`;
    const { data: response } = await axios.post(
      "https://api.thegraph.com/subgraphs/name/brainstormk/brewswap-polygon",
      {
        query,
      }
    );
    return {
      ...response.data.pair,
      address: response.data.pair.id,
      price: Number(response.data.pair.token0Price),
      price24h: 0,
      price24hHigh: 0,
      price24hLow: 0,
      voluem24h: 0,
      price24hChange: 0,
      chainId,
      token0: {
        ...response.data.pair.token0,
        address: response.data.pair.token0.id,
      },
      token1: {
        ...response.data.pair.token1,
        address: response.data.pair.token1.id,
      },
    };
  } catch (e) {
    console.log(e);
    return {};
  }
}

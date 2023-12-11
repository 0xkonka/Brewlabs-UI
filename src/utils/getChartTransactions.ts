import axios from "axios";
import { DEXSCREENER_CHAINNAME, DEXSCREENER_DEXID, DEXSCREENER_VERSION, DEXTOOLS_CHAINNAME } from "config";
import { isAddress } from "utils";
import { simpleRpcProvider } from "./providers";
import multicall from "./multicall";
import { ERC20_ABI } from "config/abi/erc20";

export async function getBSCTransactions(txs, token) {
  if (!txs.length) return [];
  let timestamps: any = await Promise.all([
    axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", {
      url: `https://bsc-explorer-api.nodereal.io/api/tx/getDetail?hash=${txs[0]}`,
    }),
    axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", {
      url: `https://bsc-explorer-api.nodereal.io/api/tx/getDetail?hash=${txs[txs.length - 1]}`,
    }),
  ]);

  timestamps = timestamps.map((time) => time.data.result.data.blockTimeStamp);
  let { data: response } = await axios.post("https://api.thegraph.com/subgraphs/name/bcoder778/bsc-transfer-assets", {
    query: `{
        transferEvents(
          first: 1000
          orderDirection: desc
          orderBy: timestamp
          where: {contract: "${token}", timestamp_gte: "${timestamps[1]}", timestamp_lte: "${timestamps[0]}"}
        ) {
          id
          from
          to
          amount
          contract
          timestamp
          height
        }
      }`,
  });

  return response.data.transferEvents.map((event) => ({ hash: event.id.split("-")[0], timestamp: event.timestamp }));
}

export function checkString(string) {
  return !isNaN(string) && string.toString().indexOf(".") != -1;
}

export function analyzeBarLog(str, to, resolution) {
  try {
    to = to - (to % resolution);
    const temp = str.replace(/[\u0000-\u0020]/g, " ");
    const valueList = temp.split(" ").filter((value) => checkString(value));
    let values = [];
    let j = 0;
    for (let i = valueList.length - 1; i >= 7; i -= 9) {
      values.push({
        openUsd: valueList[i - 7],
        highUsd: valueList[i - 5],
        lowUsd: valueList[i - 3],
        closeUsd: valueList[i - 1],
        volumeUsd: valueList[i],
        timestamp: (to - j * resolution) * 1000,
      });
      j++;
    }

    values.reverse();
    return values;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function splitArrays(valueList) {
  let pairs = [],
    c = 0;
  pairs.push([]);
  for (let i = 0; i < valueList.length; i++) {
    const temp = valueList[i];
    pairs[c].push(temp);
    if (valueList[i - 1] === "a" && i > 0 && DEXSCREENER_DEXID.includes(valueList[i])) {
      c++;
      pairs.push([]);
    }
  }
  return pairs;
}

export async function analyzePairLog(str) {
  try {
    const temp = str.replace(/[\u0000-\u001F]/g, "#").replace(/[^a-zA-Z0-9. ]/g, "#");
    let splitList = temp.split("#").filter((value) => value !== "");
    splitList.splice(0, 1);
    const pairValues = splitArrays(splitList);
    const pairs = await Promise.all(
      pairValues.map(async (valueList) => {
        try {
          const chain = valueList.find((value) =>
            Object.keys(DEXSCREENER_CHAINNAME).find((key, i) => value.includes(DEXSCREENER_CHAINNAME[key]))
          );

          if (!chain) return null;
          valueList = valueList.filter((value) => value !== chain);

          const chainId = Object.keys(DEXSCREENER_CHAINNAME).find((key, i) =>
            chain.includes(DEXSCREENER_CHAINNAME[key])
          );

          let dexIds = valueList.filter((value) => DEXSCREENER_DEXID.includes(value));
          if (dexIds.length === 1) {
            dexIds = [dexIds[0], dexIds[0]];
          }

          let addresses = [],
            names = [],
            symbols = [],
            index = 0;
          valueList.map((value, i) => {
            const splitAddresses = value
              .split("T")
              .filter((addr) => isAddress(addr))
              .map((addr) => addr.toLowerCase());

            addresses = [...addresses, ...splitAddresses];
            if (splitAddresses.length > 0) {
              if (index === 0) {
                names.push(valueList[i + 1]);
              }
              if (index === 1) {
                symbols.push(value.split("T")[0]);
                names.push(valueList[i + 1]);
                symbols.push(valueList[i + 2]);
              }
              index++;
            }
          });

          const prices = valueList.filter((value) => checkString(value));
          if (!dexIds[1]) return null;

          const url = `https://io.dexscreener.com/dex/chart/amm/v2/${dexIds[1]}/bars/${
            DEXSCREENER_CHAINNAME[chainId]
          }/${addresses[0]}?from=${Date.now() - 86400000 * 2}&to=${Date.now()}&res=1440&cb=1`;
          const result = await Promise.all([
            axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", { url }),
            multicall(
              ERC20_ABI,
              [
                { name: "balanceOf", address: addresses[1], params: [addresses[0]] },
                { name: "decimals", address: addresses[1] },
              ],
              Number(chainId)
            ),
          ]);

          const liquidity = (result[1][0][0] * Number(prices[1]) * 2) / Math.pow(10, result[1][1][0]);
          const priceBar = analyzeBarLog(result[0].data.result, Date.now(), 1440);
          let priceChange = 0,
            volume = 0;
          if (priceBar.length) {
            const { closeUsd, openUsd, volumeUsd } = priceBar[0];
            volume = Number(volumeUsd);
            priceChange = openUsd ? ((closeUsd - openUsd) / openUsd) * 100 : 0;
          }
          return {
            chainId: Number(chainId),
            a: dexIds[1],
            dexId: dexIds[0],
            address: addresses[0],
            pairAddress: addresses[0],
            baseToken: {
              address: addresses[1],
              name: names[0],
              symbol: symbols[0],
              price: Number(prices[1]),
            },
            quoteToken: {
              address: addresses[2],
              name: names[1],
              symbol: symbols[1],
              price: prices[1] / prices[0],
            },
            priceUsd: Number(prices[1]),
            reserve0: 0,
            reserve1: 0,
            liquidity: { usd: liquidity },
            tvl: liquidity,
            volume: { h24: volume ?? 0 },
            priceChange: { h24: priceChange ?? 0 },
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      })
    );
    return pairs.filter((pair) => pair);
  } catch (e) {
    console.log(e);
    return [];
  }
}

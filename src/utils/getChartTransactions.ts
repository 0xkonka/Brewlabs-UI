import axios from "axios";

export async function getPancakeswapV2Transactions(txs, pair) {
  let timestamps: any = await Promise.all([
    axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", {
      url: `https://bsc-explorer-api.nodereal.io/api/tx/getDetail?hash=${txs[0]}`,
    }),
    axios.post("https://pein-api.vercel.app/api/tokenController/getHTML", {
      url: `https://bsc-explorer-api.nodereal.io/api/tx/getDetail?hash=${txs[txs.length - 1]}`,
    }),
  ]);

  timestamps = timestamps.map((time) => time.data.result.data.blockTimeStamp);
  let { data: response } = await axios.post(
    "https://data-platform.nodereal.io/graph/v1/59e783c72fc84fcb9274f57574e23878/projects/pancakeswap",
    {
      query: `{
                swaps(first: 1000, where: {timestamp_gte: "${timestamps[1]}", timestamp_lte: "${timestamps[0]}", pair: "${pair}"}) {
                  timestamp
                  transaction{
                    id
                  }
                  pair{
                    id
                  }
                  from
                  id
                }
              }`,
    }
  );

  return response.data.swaps.map((swap) => ({ hash: swap.transaction.id, timestamp: swap.timestamp }));
}

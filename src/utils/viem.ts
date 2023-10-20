import { ChainId } from "@brewlabs/sdk";
import { createPublicClient, http, fallback, PublicClient } from "viem";

import { PUBLIC_NODES, SupportedChains } from "config/constants/networks";
import { sample } from "lodash";

export const viemClients = SupportedChains.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.id]: createPublicClient({
      chain: cur,
      transport: http(sample(PUBLIC_NODES[cur.id])),
      // fallback(
      //   (PUBLIC_NODES[cur.id] as string[]).map((url) =>
      //     http(url, {
      //       timeout: 150_000,
      //     })
      //   ),
      //   // {
      //   //   rank: false,
      //   // }
      // ),
      batch: {
        multicall: {
          batchSize: 1024 * 200,
          wait: 16,
        },
      },
      pollingInterval: 6_000,
    }),
  };
}, {} as Record<ChainId, PublicClient>);

export const getViemClients = ({ chainId }: { chainId?: ChainId }) => {
  return viemClients[chainId];
};

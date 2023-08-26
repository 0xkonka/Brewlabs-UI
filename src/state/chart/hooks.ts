import { useSelector } from "react-redux";

import { State } from "../types";
import { ChainId } from "@brewlabs/sdk";
import { SerializedPairData } from "./type";

export const usePairInfo = (chainId: ChainId, address: string): SerializedPairData => {
  const pair = useSelector((state: State) => state.chart.pairs[chainId]?.[address]);
  return pair;
};

export const usePairInfoByParams = (params): SerializedPairData[] => {
  let pairs = [];
  useSelector((state: State) => {
    Object.keys(state.chart.pairs).map((chainId, i) =>
      Object.keys(state.chart.pairs[chainId]).map((address, j) => {
        if (state.chart.pairs[chainId][address].params.includes(JSON.stringify(params)))
          pairs.push(state.chart.pairs[chainId][address]);
      })
    );
  });
  return pairs;
};

export const useAllPairInfo = (): Record<number, Record<string, SerializedPairData>> => {
  const pairs = useSelector((state: State) => state.chart.pairs);
  return pairs;
};

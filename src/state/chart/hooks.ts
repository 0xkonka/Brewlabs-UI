import { useSelector } from "react-redux";

import { State } from "../types";
import { ChainId } from "@brewlabs/sdk";
import { SerializedPairData } from "./type";

export const usePairInfo = (chainId: ChainId, address: string): SerializedPairData => {
  const pair = useSelector((state: State) => state.chart.pairs[chainId]?.[address.toLowerCase()]);
  return pair;
};

function isPair(pair, criteria) {
  return (
    pair.pairAddress.toLowerCase().includes(criteria) ||
    pair.baseToken.address.toLowerCase().includes(criteria) ||
    pair.baseToken.name.toLowerCase().includes(criteria) ||
    pair.baseToken.symbol.toLowerCase().includes(criteria) ||
    pair.quoteToken.address.toLowerCase().includes(criteria) ||
    pair.quoteToken.name.toLowerCase().includes(criteria) ||
    pair.quoteToken.symbol.toLowerCase().includes(criteria)
  );
}

export const usePairsByCriteria = (criteria, chainId = null, limit = 1): SerializedPairData[] => {
  let pairs = [];
  const _criteria = criteria?.toLowerCase();
  useSelector((state: State) =>
    Object.keys(state.chart.pairs).map((_chainId, i) =>
      Object.keys(state.chart.pairs[_chainId]).map((address, j) => {
        if (chainId && Number(_chainId) !== Number(chainId)) return;
        const pair = state.chart.pairs[_chainId][address];
        if (isPair(pair, _criteria)) pairs.push(state.chart.pairs[_chainId][address]);
      })
    )
  );
  if (criteria === "") return [];
  return pairs.sort((a, b) => b.volume.h24 - a.volume.h24).slice(0, limit);
};

export const usePairsByCriterias = (criterias): SerializedPairData[] => {
  let totalPairs = [];
  useSelector((state: State) => {
    criterias.map((criteria) => {
      if (criteria === "") return [];
      let pairs = [];
      const _criteria = criteria?.toLowerCase();
      Object.keys(state.chart.pairs).map((_chainId, i) =>
        Object.keys(state.chart.pairs[_chainId]).map((address, j) => {
          const pair = state.chart.pairs[_chainId][address];
          const isExisting = totalPairs.find(
            (_pair) => _pair.address === pair.address && _pair.chainId === pair.chainId
          );
          if (isPair(pair, _criteria) && !isExisting) pairs.push(state.chart.pairs[_chainId][address]);
        })
      );
      pairs = pairs.sort((a, b) => b.volume.h24 - a.volume.h24).slice(0, 1);
      totalPairs = [...totalPairs, ...pairs];
    });
  });
  return totalPairs;
};

export const useAllPairInfo = (): Record<number, Record<string, SerializedPairData>> => {
  const pairs = useSelector((state: State) => state.chart.pairs);
  return pairs;
};

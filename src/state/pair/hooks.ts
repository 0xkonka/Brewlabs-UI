import { useFastRefreshEffect } from "@hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { isAddress } from "utils";
import { fetchTradingAllPairAsync, fetchTradingPairAsync, fetchTradingPairFeesAsync } from ".";
import { ChainId } from "@brewlabs/sdk";
import { SerializedTradingPair, State } from "state/types";
import { useSelector } from "react-redux";
import { useState } from "react";

export const useTradingPair = (chainId, address) => {
  const dispatch = useAppDispatch();
  const data = useTradingPairData(chainId, address?.toLowerCase());
  useFastRefreshEffect(() => {
    if (!isAddress(address)) return;
    dispatch(fetchTradingPairAsync(chainId, address.toLowerCase()));
    dispatch(fetchTradingPairFeesAsync(chainId, address.toLowerCase()));
  }, [dispatch, chainId, address]);
  return { data };
};

export const useTradingAllPairs = (chainId: ChainId) => {
  const pairs = useTradingAllPairDatas(chainId);
  const dispatch = useAppDispatch();
  useFastRefreshEffect(() => {
    dispatch(fetchTradingAllPairAsync(chainId));
  }, [dispatch, chainId]);
  return pairs;
};

export const useTradingPairData = (chainId: ChainId, pair: string): SerializedTradingPair => {
  return useSelector((state: State) => state.pair.tradingPairs[chainId]?.[pair] ?? {});
};

export const useTradingAllPairDatas = (chainId: ChainId): SerializedTradingPair[] => {
  return useSelector((state: State) =>
    state.pair.tradingPairs[chainId]
      ? Object.keys(state.pair.tradingPairs[chainId])
          .filter((address) => state.pair.tradingPairs[chainId][address])
          .map((address) => state.pair.tradingPairs[chainId][address])
      : []
  );
};

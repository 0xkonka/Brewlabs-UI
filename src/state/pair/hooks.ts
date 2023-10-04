import { useFastRefreshEffect } from "@hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { isAddress } from "utils";
import { fetchTradingPairAsync } from ".";
import { ChainId } from "@brewlabs/sdk";
import { SerializedTradingPair, State } from "state/types";
import { useSelector } from "react-redux";

export const useTradingPair = (chainId, pair) => {
  const dispatch = useAppDispatch();
  const data = useTradingPairData(chainId, pair);

  useFastRefreshEffect(() => {
    if (!isAddress(pair)) return;
    dispatch(fetchTradingPairAsync(chainId, pair));
  }, [dispatch, chainId, pair]);
  return { data };
};

export const useTradingPairData = (chainId: ChainId, pair: string): SerializedTradingPair => {
  return useSelector((state: State) => state.pair.tradingPairs[chainId]?.[pair] ?? {});
};

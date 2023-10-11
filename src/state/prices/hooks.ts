import { ChainId } from "@brewlabs/sdk";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { AppId } from "config/constants/types";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useSlowRefreshEffect } from "@hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { LpTokenPricesState, State } from "state/types";

import { fetchLpTokenPrices, fetchMarketDataAsync } from ".";

export const useFetchLpTokenPrices = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveChainId();

  const farms = useSelector((state: State) => state.zap.data[AppId.APESWAP]);

  useEffect(() => {
    dispatch(fetchLpTokenPrices(chainId, farms));
  }, [dispatch, JSON.stringify(farms), chainId]);
};

export const useFetchMarketData = () => {
  const dispatch = useAppDispatch();

  useSlowRefreshEffect(() => {
    dispatch(fetchMarketDataAsync(ChainId.ETHEREUM));
    dispatch(fetchMarketDataAsync(ChainId.BSC_MAINNET));
    dispatch(fetchMarketDataAsync(ChainId.ARBITRUM));
    dispatch(fetchMarketDataAsync(ChainId.POLYGON));
  }, [dispatch]);
};

export const useLpTokenPrices = () => {
  const { isInitialized, isLoading, data }: LpTokenPricesState = useSelector(
    (state: State) => state.prices.lpTokenPrices
  );
  return { lpTokenPrices: data, isInitialized, isLoading };
};

export const useTokenMarketChart = (chainId) => {
  const marketData = useSelector((state: State) => state.prices.marketDatas[chainId] ?? {});
  return marketData;
};

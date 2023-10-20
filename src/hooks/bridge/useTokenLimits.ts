import { useState, useCallback, useEffect } from "react";

import { useBridgeContext } from "contexts/BridgeContext";
import { fetchTokenLimits } from "lib/bridge/bridge";
import { useBridgeDirection } from "./useBridgeDirection";

export const useTokenLimits = () => {
  const { fromToken, toToken, currentDay }: any = useBridgeContext();
  const { bridgeDirectionId, homeChainId, foreignChainId, mediatorData } = useBridgeDirection();
  const [tokenLimits, setTokenLimits] = useState<any>();
  const [fetching, setFetching] = useState(false);

  const { minPerTx, dailyLimit: _dailyLimit, totalSpentPerDay } = mediatorData[fromToken.chainId];
  const { executionMaxPerTx: maxPerTx, executionDailyLimit, totalExecutedPerDay } = mediatorData[toToken.chainId];
  const remainingExecutionLimit = BigInt(executionDailyLimit) - BigInt(totalExecutedPerDay);
  const remainingRequestLimit = BigInt(_dailyLimit) - BigInt(totalSpentPerDay);
  const remainingLimit =
    remainingRequestLimit < remainingExecutionLimit ? remainingRequestLimit : remainingExecutionLimit;
  const dailyLimit = _dailyLimit < executionDailyLimit ? _dailyLimit : executionDailyLimit;

  const updateTokenLimits = useCallback(async () => {
    if (
      fromToken &&
      toToken &&
      fromToken.chainId &&
      toToken.chainId &&
      (fromToken.symbol.includes(toToken.symbol) || toToken.symbol.includes(fromToken.symbol)) &&
      [homeChainId, foreignChainId].includes(fromToken.chainId) &&
      [homeChainId, foreignChainId].includes(toToken.chainId) &&
      currentDay
    ) {
      setFetching(true);
      const limits = await fetchTokenLimits(bridgeDirectionId, fromToken, toToken, currentDay);
      setTokenLimits(limits);
      setFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, homeChainId, foreignChainId, currentDay]);

  useEffect(() => {
    updateTokenLimits();
  }, [updateTokenLimits]);

  return { tokenLimits, fetching, refresh: updateTokenLimits };
};

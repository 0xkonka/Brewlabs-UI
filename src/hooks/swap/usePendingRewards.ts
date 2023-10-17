import { useMemo } from "react";
import { Address } from "viem";

import BrewlabsFeeManagerAbi from "config/abi/swap/brewlabsFeeManager";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useSingleContractMultipleData } from "state/multicall/hooks";
import { getBrewlabsFeeManagerAddress } from "utils/addressHelpers";

export const usePendingRewards = (pairs) => {
  const { chainId, account } = useActiveWeb3React();
  // const account = "0xe1f1dd010bbc2860f81c8f90ea4e38db949bb16f";

  const outputOfRewards = useSingleContractMultipleData({
    contract: useMemo(
      () => ({
        abi: BrewlabsFeeManagerAbi,
        address: getBrewlabsFeeManagerAddress(chainId) as Address,
      }),
      [chainId]
    ),
    functionName: "pendingRewards",
    args: useMemo(() => pairs.map((pair) => [pair.id, account] as const), [pairs]),
  });

  return Object.fromEntries(outputOfRewards.map((data, index) => [pairs[index].id, data.result]));
};

import { useCallback } from "react";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { usePoolFactoryContract } from "@hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const usePoolFactory = (chainId, performanceFee) => {
  const { library } = useActiveWeb3React();
  const poolContract = usePoolFactoryContract(chainId);

  const handleCreateSinglePool = useCallback(
    async (
      stakingToken: string,
      rewardToken: string,
      dividendToken: string,
      duration: number,
      rewardPerBlock: string,
      depositFee: string,
      withdrawFee: string,
      hasDividend: boolean
    ) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await poolContract.estimateGas.createBrewlabsSinglePool(
        stakingToken,
        rewardToken,
        dividendToken,
        duration,
        rewardPerBlock,
        depositFee,
        withdrawFee,
        duration,
        hasDividend,
        { value: performanceFee, gasPrice }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await poolContract.createBrewlabsSinglePool(
        stakingToken,
        rewardToken,
        dividendToken,
        duration,
        rewardPerBlock,
        depositFee,
        withdrawFee,
        hasDividend,
        { value: performanceFee, gasPrice, gasLimit }
      );
      const receipt = await tx.wait();

      return receipt;
    },
    [poolContract, chainId, library, performanceFee]
  );

  return {
    onCreateSinglePool: handleCreateSinglePool,
  };
};

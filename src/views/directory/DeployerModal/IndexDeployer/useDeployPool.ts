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

  const handleCreateLockupPool = useCallback(
    async (
      stakingToken: string,
      rewardToken: string,
      dividendToken: string,
      duration: number,
      lockDurations: number[],
      rewardPerBlocks: string[],
      depositFees: string[],
      withdrawFees: string[]
    ) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await poolContract.estimateGas.createBrewlabsLockupPools(
        stakingToken,
        rewardToken,
        dividendToken,
        duration,
        lockDurations,
        rewardPerBlocks,
        depositFees,
        withdrawFees,
        { value: performanceFee, gasPrice }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await poolContract.createBrewlabsLockupPools(
        stakingToken,
        rewardToken,
        dividendToken,
        duration,
        lockDurations,
        rewardPerBlocks,
        depositFees,
        withdrawFees,
        { value: performanceFee, gasPrice, gasLimit }
      );
      const receipt = await tx.wait();

      return receipt;
    },

    [poolContract, chainId, library, performanceFee]
  );

  const handleCreateLockupPoolWithPanelty = useCallback(
    async (
      stakingToken: string,
      rewardToken: string,
      dividendToken: string,
      duration: number,
      lockDurations: number[],
      rewardPerBlocks: string[],
      depositFees: string[],
      withdrawFees: string[],
      penaltyFee: number
    ) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await poolContract.estimateGas.createBrewlabsLockupPoolsWithPenalty(
        stakingToken,
        rewardToken,
        dividendToken,
        duration,
        lockDurations,
        rewardPerBlocks,
        depositFees,
        withdrawFees,
        penaltyFee,
        { value: performanceFee, gasPrice }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await poolContract.createBrewlabsLockupPoolsWithPenalty(
        stakingToken,
        rewardToken,
        dividendToken,
        duration,
        duration,
        lockDurations,
        rewardPerBlocks,
        depositFees,
        withdrawFees,
        penaltyFee,
        { value: performanceFee, gasPrice, gasLimit }
      );
      const receipt = await tx.wait();

      return receipt;
    },

    [poolContract, chainId, library, performanceFee]
  );

  return {
    onCreateSinglePool: handleCreateSinglePool,
    onCreateLockupPool: handleCreateLockupPool,
    onCreateLockupPoolWithPenalty: handleCreateLockupPoolWithPanelty,
  };
};

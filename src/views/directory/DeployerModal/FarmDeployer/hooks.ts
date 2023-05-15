import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { useFarmFactoryContract } from "@hooks/useContract";
import { useCallback } from "react";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const useFarmFactory = (chainId, performanceFee) => {
  const { library } = useActiveWeb3React();
  const factoryContract = useFarmFactoryContract(chainId);

  const handleCreate = useCallback(
    async (
      lpToken: string,
      rewardToken: string,
      dividendToken: string,
      rewardPerBlock: string,
      depositFee: number,
      withdrawFee: number,
      hasDividend: boolean
    ) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await factoryContract.estimateGas.createBrewlabsFarm(
        lpToken,
        rewardToken,
        dividendToken,
        rewardPerBlock,
        depositFee,
        withdrawFee,
        hasDividend,
        { value: performanceFee }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await factoryContract.createBrewlabsFarm(
        lpToken,
        rewardToken,
        dividendToken,
        rewardPerBlock,
        depositFee,
        withdrawFee,
        hasDividend,
        { value: performanceFee, gasLimit }
      );
      const receipt = await tx.wait();

      return receipt;
    },
    [factoryContract, chainId, library, performanceFee]
  );

  return {
    onCreate: handleCreate,
  };
};

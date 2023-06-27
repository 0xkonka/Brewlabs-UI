import { useCallback } from "react";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { useNftStakingContract } from "@hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const useNftStaking = (chainId, performanceFee) => {
  const { library } = useActiveWeb3React();
  const nftStakingContract = useNftStakingContract(chainId);

  const handleStake = useCallback(
    async (tokenIds: number[]) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await nftStakingContract.estimateGas.deposit(tokenIds, { value: performanceFee, gasPrice });
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await nftStakingContract.deposit(tokenIds, { value: performanceFee, gasPrice, gasLimit });
      const receipt = await tx.wait();

      return receipt;
    },
    [nftStakingContract, chainId, library]
  );

  const handleUnstake = useCallback(
    async (amount: number) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await nftStakingContract.estimateGas.withdraw(amount, { value: performanceFee, gasPrice });
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await nftStakingContract.withdraw(amount, { value: performanceFee, gasPrice, gasLimit });
      const receipt = await tx.wait();

      return receipt;
    },
    [nftStakingContract, chainId, library]
  );

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
  };
};

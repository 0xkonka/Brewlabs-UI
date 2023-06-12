import { useCallback } from "react";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { useIndexFactoryContract } from "@hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const useFactory = (chainId, performanceFee) => {
  const { library } = useActiveWeb3React();
  const factoryContract = useIndexFactoryContract(chainId);

  const handleCreate = useCallback(
    async (indexName: string, tokens: string[], commissionFee: number, commissionWallet: string, isPublic = true) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      let gasLimit = await factoryContract.estimateGas.createBrewlabsIndex(
        indexName,
        tokens,
        commissionFee,
        commissionWallet,
        isPublic,
        { value: performanceFee, gasPrice }
      );
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await factoryContract.createBrewlabsIndex(
        indexName,
        tokens,
        commissionFee,
        commissionWallet,
        isPublic,
        { value: performanceFee, gasPrice, gasLimit }
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

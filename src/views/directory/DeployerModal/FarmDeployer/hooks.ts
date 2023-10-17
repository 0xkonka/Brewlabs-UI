import { useCallback } from "react";
import { useWalletClient } from "wagmi";

import FarmFactoryAbi from "config/abi/farm/factory";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { calculateGasMargin } from "utils";
import { getFarmFactoryAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const useFactory = (chainId, performanceFee) => {
  const { data: walletClient } = useWalletClient();

  const handleCreate = useCallback(
    async (
      lpToken: string,
      rewardToken: string,
      dividendToken: string,
      rewardPerBlock: string,
      depositFee: string,
      withdrawFee: string,
      duration: number,
      hasDividend: boolean
    ) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      const txData: any = {
        address: getFarmFactoryAddress(chainId) as `0x${string}`,
        abi: FarmFactoryAbi,
        functionName: "createBrewlabsFarm",
        args: [
          lpToken as `0x${string}`,
          rewardToken as `0x${string}`,
          dividendToken as `0x${string}`,
          BigInt(rewardPerBlock),
          BigInt(depositFee),
          BigInt(withdrawFee),
          BigInt(duration),
          hasDividend,
        ],
        value: performanceFee,
        gasPrice,
        account: walletClient.account,
      };
      let gasLimit = await client.estimateContractGas(txData);
      gasLimit = calculateGasMargin(gasLimit);

      const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [walletClient, chainId, performanceFee]
  );

  return {
    onCreate: handleCreate,
  };
};

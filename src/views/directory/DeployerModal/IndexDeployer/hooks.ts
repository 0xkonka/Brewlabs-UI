import { useCallback } from "react";
import { useWalletClient } from "wagmi";

import IndexFactoryAbi from "config/abi/indexes/factory";
import { getIndexFactoryAddress } from "utils/addressHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";
import { calculateGasMargin } from "utils";

export const useFactory = (chainId, performanceFee) => {
  const { data: walletClient } = useWalletClient();

  const handleCreate = useCallback(
    async (indexName: string, tokens: string[], fees: number[], commissionWallet: string, isPrivate = true) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      const txData: any = {
        address: getIndexFactoryAddress(chainId) as `0x${string}`,
        abi: IndexFactoryAbi,
        functionName: "createBrewlabsIndex",
        args: [
          indexName,
          tokens.map((t) => t as `0x${string}`),
          [BigInt(Math.floor(fees[0] * 100).toString()), BigInt(Math.floor(fees[1] * 100).toString())],
          commissionWallet as `0x${string}`,
          isPrivate,
        ],
        value: performanceFee,
        gasPrice,
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

import { useCallback } from "react";
import { erc721ABI, useWalletClient } from "wagmi";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { getViemClients } from "utils/viem";
import { calculateGasMargin } from "utils";

const useNftApprove = (nftAddr) => {
  const { chainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();

  const handleApprove = useCallback(
    async (spender) => {
      const client = getViemClients({ chainId });

      const txData: any = {
        address: nftAddr as `0x${string}`,
        abi: erc721ABI,
        functionName: "setApprovalForAll",
        args: [spender as `0x${string}`, true],
        account: walletClient.account,
      };
      let gasLimit = await client.estimateContractGas(txData);
      gasLimit = calculateGasMargin(gasLimit);

      const txHash = await walletClient.writeContract({
        ...txData,
        chain: walletClient.chain,
        gas: gasLimit,
      });

      return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [nftAddr, chainId, walletClient]
  );

  return { onApprove: handleApprove };
};

export default useNftApprove;

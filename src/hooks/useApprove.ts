import { useCallback } from "react";
import { parseEther } from "viem";
import { erc721ABI, useWalletClient } from "wagmi";

import { getViemClients } from "utils/viem";
import { useActiveChainId } from "./useActiveChainId";

export const useTokenApprove = () => {
  const { chainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();

  const handleApprove = useCallback(
    async (tokenAddress, spender) => {
      const client = getViemClients({ chainId });
      const gasPrice = await client.getGasPrice();
      const txHash = await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc721ABI,
        functionName: "approve",
        args: [spender as `0x${string}`, parseEther("10000000000000000000")],
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      });
      return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [chainId, walletClient]
  );

  return { onApprove: handleApprove };
};

import { useCallback } from "react";
import { erc721ABI, useWalletClient } from "wagmi";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useERC721 } from "hooks/useContract";
import { getViemClients } from "utils/viem";

const useNftApprove = (nftAddr) => {
  const { chainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();
  const nftContract = useERC721(nftAddr);

  const handleApprove = useCallback(
    async (spender) => {
      const publicClient = getViemClients({ chainId });

      const txData: any = {
        address: nftAddr as `0x${string}`,
        abi: erc721ABI,
        functionName: "setApprovalForAll",
        args: [spender as `0x${string}`, true],
        account: walletClient.account,
      };
      let gasLimit = await publicClient.estimateContractGas(txData);
      gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

      const txHash = await walletClient.writeContract({
        ...txData,
        chain: walletClient.chain,
        gas: gasLimit,
      });

      return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [nftContract]
  );

  return { onApprove: handleApprove };
};

export default useNftApprove;

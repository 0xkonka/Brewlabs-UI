import { useCallback } from "react";
import { useWalletClient } from "wagmi";

import FlaskNftAbi from "config/abi/nfts/flaskNft";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { getFlaskNftAddress } from "utils/addressHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

export const useFlaskNft = () => {
  const { chainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();

  const handleMint = useCallback(
    async (count: number, payingToken: string) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId, publicClient);

      const txData: any = {
        address: getFlaskNftAddress(chainId) as `0x${string}`,
        abi: FlaskNftAbi,
        functionName: "mint",
        args: [BigInt(count), payingToken as `0x${string}`],
        account: walletClient.account,
        gasPrice,
      };
      let gasLimit = await publicClient.estimateContractGas(txData);
      gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

      const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });

      return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [walletClient, chainId]
  );
  const handleUpgradeNft = useCallback(
    async (tokenIds: number[], payingToken: string) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId, publicClient);

      const _tokenIds: any = [BigInt(tokenIds[0]), BigInt(tokenIds[1]), BigInt(tokenIds[2])];

      const txData: any = {
        address: getFlaskNftAddress(chainId) as `0x${string}`,
        abi: FlaskNftAbi,
        functionName: "upgradeNFT",
        args: [_tokenIds, payingToken as `0x${string}`],
        account: walletClient.account,
        gasPrice,
      };
      let gasLimit = await publicClient.estimateContractGas(txData);
      gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

      const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });

      return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [walletClient, chainId]
  );

  return {
    onMint: handleMint,
    onUpgrade: handleUpgradeNft,
  };
};

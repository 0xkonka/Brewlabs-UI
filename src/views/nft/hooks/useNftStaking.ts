import { useCallback } from "react";
import { useWalletClient } from "wagmi";

import NftStakingAbi from "config/abi/nfts/nftStaking";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { getNftStakingAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const useNftStaking = (performanceFee) => {
  const { chainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();

  const handleStake = useCallback(
    async (tokenIds: number[]) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await publicClient.getGasPrice();

      const txData: any = {
        address: getNftStakingAddress(chainId) as `0x${string}`,
        abi: NftStakingAbi,
        functionName: "deposit",
        args: [tokenIds.map((t) => BigInt(t))],
        value: performanceFee,
        account: walletClient.account,
        gasPrice,
      };
      let gasLimit = await publicClient.estimateContractGas(txData);
      gasLimit = (gasLimit * BigInt(1200)) / BigInt(1000);

      const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [chainId, walletClient, performanceFee]
  );

  const handleClaim = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await publicClient.getGasPrice();

    const txData: any = {
      address: getNftStakingAddress(chainId) as `0x${string}`,
      abi: NftStakingAbi,
      functionName: "claimReward",
      value: performanceFee,
      account: walletClient.account,
      gasPrice,
    };
    let gasLimit = await publicClient.estimateContractGas(txData);

    const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
    return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
  }, [chainId, walletClient, performanceFee]);

  const handleUnstake = useCallback(
    async (amount: number) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await publicClient.getGasPrice();

      const txData: any = {
        address: getNftStakingAddress(chainId) as `0x${string}`,
        abi: NftStakingAbi,
        functionName: "withdraw",
        args: [BigInt(amount)],
        value: performanceFee,
        account: walletClient.account,
        gasPrice,
      };
      let gasLimit = await publicClient.estimateContractGas(txData);

      const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [chainId, walletClient, performanceFee]
  );

  const handleUnstakeNft = useCallback(
    async (tokenId: number) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await publicClient.getGasPrice();

      const txData: any = {
        address: getNftStakingAddress(chainId) as `0x${string}`,
        abi: NftStakingAbi,
        functionName: "withdrawNft",
        args: [BigInt(tokenId)],
        value: performanceFee,
        account: walletClient.account,
        gasPrice,
      };
      let gasLimit = await publicClient.estimateContractGas(txData);

      const txHash = await walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
    },
    [chainId, walletClient, performanceFee]
  );

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onUnstakeNft: handleUnstakeNft,
    onClaim: handleClaim,
  };
};

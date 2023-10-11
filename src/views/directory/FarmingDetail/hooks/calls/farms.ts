import { calculateGasMargin } from "utils";
import { PublicClient, WalletClient, parseEther } from "viem";

export const stakeFarm = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "deposit" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...masterChefContract, functionName: "deposit", gas: gasLimit });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

export const unstakeFarm = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "withdraw" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...masterChefContract, functionName: "withdraw", gas: gasLimit });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

export const emergencyUnstakeFarm = async (
  masterChefContract,
  walletClient: WalletClient,
  publicClient: PublicClient
) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "emergencyWithdraw" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...masterChefContract,
    functionName: "emergencyWithdraw",
    gas: gasLimit,
  });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

export const harvestFarm = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "deposit" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...masterChefContract, functionName: "deposit", gas: gasLimit });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

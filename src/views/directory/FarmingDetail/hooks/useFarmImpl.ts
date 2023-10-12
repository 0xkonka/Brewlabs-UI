import { useCallback } from "react";
import { ChainId } from "@brewlabs/sdk";
import { PublicClient, WalletClient, parseEther } from "viem";
import { useWalletClient } from "wagmi";

import FarmImpleAbi from "config/abi/farm/farmImpl";
import { useAppDispatch } from "state";
import { updateFarmsUserData } from "state/farms";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const stakeFarm = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "deposit" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "deposit",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const unstakeFarm = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "withdraw" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "withdraw",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const emergencyUnstakeFarm = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "emergencyWithdraw" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "emergencyWithdraw",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const harvestReward = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "claimReward" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "claimReward",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const harvestDividend = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "claimDividend" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "claimDividend",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const compoundReward = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "compoundReward" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "compoundReward",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const compoundDividend = async (farmContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas({ ...farmContract, functionName: "compoundDividend" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...farmContract,
    functionName: "compoundDividend",
    gas: gasLimit,
  });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useFarmImpl = (
  pid: number,
  farmId: number,
  chainId: ChainId,
  contractAddress: string,
  performanceFee = "0",
  enableEmergencyWithdraw = false
) => {
  const dispatch = useAppDispatch();
  const { data: walletClient } = useWalletClient();

  const handleStake = useCallback(
    async (amount: string) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      let farmContract = {
        address: contractAddress,
        abi: FarmImpleAbi,
        args: [parseEther(amount)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      const receipt = await stakeFarm(farmContract, walletClient, client);

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
      return receipt;
    },
    [pid, farmId, chainId, contractAddress, performanceFee, dispatch, walletClient]
  );

  const handleUnstake = useCallback(
    async (amount: string) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      let farmContract = {
        address: contractAddress,
        abi: FarmImpleAbi,
        args: enableEmergencyWithdraw ? [] : [parseEther(amount)],
        value: enableEmergencyWithdraw ? undefined : performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      let receipt;
      if (enableEmergencyWithdraw) {
        receipt = await emergencyUnstakeFarm(farmContract, walletClient, client);
      } else {
        receipt = await unstakeFarm(farmContract, walletClient, client);
      }

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
      return receipt;
    },
    [pid, farmId, chainId, contractAddress, enableEmergencyWithdraw, performanceFee, dispatch, walletClient]
  );

  const handleHarvestReward = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let farmContract = {
      address: contractAddress,
      abi: FarmImpleAbi,
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await harvestReward(farmContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
  }, [pid, farmId, chainId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleHarvestDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let farmContract = {
      address: contractAddress,
      abi: FarmImpleAbi,
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await harvestDividend(farmContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleCompoundReward = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let farmContract = {
      address: contractAddress,
      abi: FarmImpleAbi,
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await compoundReward(farmContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
  }, [pid, farmId, chainId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleCompoundDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let farmContract = {
      address: contractAddress,
      abi: FarmImpleAbi,
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    await compoundDividend(farmContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, contractAddress, performanceFee, dispatch, walletClient]);

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onHarvest: handleHarvestReward,
    onCompound: handleCompoundReward,
    onHarvestDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useFarmImpl;

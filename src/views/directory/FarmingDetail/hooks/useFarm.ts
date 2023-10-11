import { useCallback } from "react";
import { ChainId } from "@brewlabs/sdk";
import { PublicClient, WalletClient, parseEther } from "viem";
import { useWalletClient } from "wagmi";

import masterChefV2Abi from "config/abi/farm/masterchefV2";
import { useAppDispatch } from "state";
import { updateFarmsUserData } from "state/farms";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

import { emergencyUnstakeFarm, harvestFarm, stakeFarm, unstakeFarm } from "./calls/farms";

const harvestReward = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "claimReward" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...masterChefContract,
    functionName: "claimReward",
    gas: gasLimit,
  });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const harvestDividend = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "claimDividend" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...masterChefContract,
    functionName: "claimDividend",
    gas: gasLimit,
  });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const compoundReward = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "compoundReward" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...masterChefContract,
    functionName: "compoundReward",
    gas: gasLimit,
  });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const compoundDividend = async (masterChefContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas({ ...masterChefContract, functionName: "compoundDividend" });
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({
    ...masterChefContract,
    functionName: "compoundDividend",
    gas: gasLimit,
  });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useFarm = (
  pid: number,
  farmId: number,
  chainId: ChainId,
  masterchef: string,
  performanceFee = "0",
  enableEmergencyWithdraw = false
) => {
  const dispatch = useAppDispatch();
  const { data: walletClient } = useWalletClient();

  const handleStake = useCallback(
    async (amount: string) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(publicClient, chainId);

      let masterChefContract = {
        address: masterchef as `0x${string}`,
        abi: masterChefV2Abi,
        args: [BigInt(pid), parseEther(amount)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      const receipt = await stakeFarm(masterChefContract, walletClient, publicClient);

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
      return receipt;
    },
    [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]
  );

  const handleUnstake = useCallback(
    async (amount: string) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(publicClient, chainId);

      let masterChefContract = {
        address: masterchef as `0x${string}`,
        abi: masterChefV2Abi,
        args: enableEmergencyWithdraw ? [BigInt(pid)] : [BigInt(pid), parseEther(amount)],
        value: enableEmergencyWithdraw ? undefined : performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      let receipt;
      if (enableEmergencyWithdraw) {
        receipt = await emergencyUnstakeFarm(masterChefContract, walletClient, publicClient);
      } else {
        receipt = await unstakeFarm(masterChefContract, walletClient, publicClient);
      }

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
      return receipt;
    },
    [pid, farmId, chainId, masterchef, enableEmergencyWithdraw, performanceFee, dispatch, walletClient]
  );

  const handleHarvest = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    await harvestFarm(masterChefContract, walletClient, publicClient);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleHarvestReward = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await harvestReward(masterChefContract, walletClient, publicClient);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleHarvestDividend = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await harvestDividend(masterChefContract, walletClient, publicClient);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleCompoundReward = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await compoundReward(masterChefContract, walletClient, publicClient);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleCompoundDividend = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await compoundDividend(masterChefContract, walletClient, publicClient);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onReward: handleHarvest,
    onHarvest: handleHarvest,
    onCompound: handleCompoundReward,
    onHarvestDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useFarm;

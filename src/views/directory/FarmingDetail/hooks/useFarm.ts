import { useCallback } from "react";
import { ChainId } from "@brewlabs/sdk";
import { PublicClient, WalletClient, parseEther } from "viem";
import { useWalletClient } from "wagmi";

import masterChefV2Abi from "config/abi/farm/masterchefV2";
import { useAppDispatch } from "state";
import { updateFarmsUserData } from "state/farms";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const call_normalMethod = async (masterChefContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas(masterChefContract);
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...masterChefContract, gas: gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
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
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      let masterChefContract = {
        address: masterchef as `0x${string}`,
        abi: masterChefV2Abi,
        functionName: "deposit",
        args: [BigInt(pid), parseEther(amount)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      const receipt = await call_normalMethod(masterChefContract, walletClient, client);

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
      return receipt;
    },
    [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]
  );

  const handleUnstake = useCallback(
    async (amount: string) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      let masterChefContract = {
        address: masterchef as `0x${string}`,
        abi: masterChefV2Abi,
        functionName: enableEmergencyWithdraw ? "emergencyWithdraw" : "withdraw",
        args: enableEmergencyWithdraw ? [BigInt(pid)] : [BigInt(pid), parseEther(amount)],
        value: enableEmergencyWithdraw ? undefined : performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      let receipt = await call_normalMethod(masterChefContract, walletClient, client);

      dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
      dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
      return receipt;
    },
    [pid, farmId, chainId, masterchef, enableEmergencyWithdraw, performanceFee, dispatch, walletClient]
  );

  const handleHarvest = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      functionName: "deposit",
      args: [BigInt(pid), BigInt(0)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    await call_normalMethod(masterChefContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleHarvestReward = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      functionName: "claimReward",
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await call_normalMethod(masterChefContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleHarvestDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      functionName: "claimDividend",
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await call_normalMethod(masterChefContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "reflections", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleCompoundReward = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      functionName: "compoundReward",
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await call_normalMethod(masterChefContract, walletClient, client);

    dispatch(updateFarmsUserData({ pid, farmId, field: "earnings", value: "0" }));
  }, [pid, farmId, chainId, masterchef, performanceFee, dispatch, walletClient]);

  const handleCompoundDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    let masterChefContract = {
      address: masterchef as `0x${string}`,
      abi: masterChefV2Abi,
      functionName: "compoundDividend",
      args: [BigInt(pid)],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };

    await call_normalMethod(masterChefContract, walletClient, client);

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

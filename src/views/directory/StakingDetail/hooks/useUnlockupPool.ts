import { useCallback } from "react";
import { PublicClient, WalletClient, parseUnits } from "viem";
import { useWalletClient } from "wagmi";

import singleStakingAbi from "config/abi/staking/singlestaking";
import { forceGasLimits } from "config/constants/pools";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import {
  updateUserStakedBalance,
  updateUserBalance,
  resetPendingReflection,
  updateUserPendingReward,
} from "state/pools";
import { updatePoolsUserData } from "state/pools";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const call_normalMethod = async (
  stakingContract,
  walletClient: WalletClient,
  client: PublicClient,
  forceGasLimit = undefined
) => {
  let gasLimit = await client.estimateContractGas(stakingContract);
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...stakingContract, gas: forceGasLimit ?? gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useUnlockupPool = (sousId: number, contractAddress, performanceFee = "0", enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: walletClient } = useWalletClient();

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      const stakingContract = {
        address: contractAddress,
        abi: singleStakingAbi,
        functionName: "deposit",
        args: [parseUnits(amount, decimals)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await call_normalMethod(stakingContract, walletClient, client);

      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: "0" }));
      dispatch(resetPendingReflection(sousId));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, sousId, contractAddress, performanceFee, dispatch, walletClient]
  );

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      const stakingContract = {
        address: contractAddress,
        abi: singleStakingAbi,
        functionName: enableEmergencyWithdraw ? "withdraw" : "emergencyWithdraw",
        args: enableEmergencyWithdraw ? [] : [parseUnits(amount, decimals)],
        value: enableEmergencyWithdraw ? "0" : performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      const receipt = await call_normalMethod(
        stakingContract,
        walletClient,
        client,
        !enableEmergencyWithdraw ? forceGasLimits[sousId] : undefined
      );

      dispatch(resetPendingReflection(sousId));
      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: "0" }));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      dispatch(updateUserPendingReward(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, sousId, contractAddress, enableEmergencyWithdraw, performanceFee, dispatch, walletClient]
  );

  const handleHarvest = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: singleStakingAbi,
      functionName: "claimReward",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(stakingContract, walletClient, client);

    dispatch(updatePoolsUserData({ sousId, field: "earnings", value: "0" }));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, sousId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleHarvestDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: singleStakingAbi,
      functionName: "claimDividend",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(stakingContract, walletClient, client);

    dispatch(resetPendingReflection(sousId));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, sousId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleCompound = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: singleStakingAbi,
      functionName: "compoundReward",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(stakingContract, walletClient, client);

    dispatch(updatePoolsUserData({ sousId, field: "earnings", value: "0" }));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserStakedBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, sousId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleCompoundDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: singleStakingAbi,
      functionName: "compoundDividend",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(stakingContract, walletClient, client);

    dispatch(resetPendingReflection(sousId));
    dispatch(updateUserPendingReward(sousId, account, chainId));
    dispatch(updateUserStakedBalance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, sousId, contractAddress, performanceFee, dispatch, walletClient]);

  return {
    onStake: handleStake,
    onUnstake: handleUnstake,
    onReward: handleHarvest,
    onCompound: handleCompound,
    onDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useUnlockupPool;

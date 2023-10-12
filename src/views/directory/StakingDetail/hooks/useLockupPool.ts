import { useCallback } from "react";
import { PublicClient, WalletClient, parseUnits } from "viem";
import { useWalletClient } from "wagmi";

import lockupStakingAbi from "config/abi/staking/brewlabsLockup";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import {
  resetPendingReflection,
  updatePoolsUserData,
  updateUserBalance,
  updateUserPendingReward,
  updateUserStakedBalance,
} from "state/pools";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const call_normalMethod = async (indexContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas(indexContract);
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...indexContract, gas: gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useLockupPool = (sousId, contractAddress, type, performanceFee = "0", enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: walletClient } = useWalletClient();

  const handleStake = useCallback(
    async (amount, decimals) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      const stakingContract = {
        address: contractAddress,
        abi: lockupStakingAbi,
        functionName: "deposit",
        args: [parseUnits(amount, decimals), BigInt(type)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      const receipt = await call_normalMethod(stakingContract, walletClient, client);

      dispatch(resetPendingReflection(sousId));
      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: "0" }));
      dispatch(updateUserPendingReward(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, sousId, contractAddress, type, performanceFee, dispatch, walletClient]
  );

  const handleUnStake = useCallback(
    async (amount, decimals) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(client, chainId);

      const stakingContract = {
        address: contractAddress,
        abi: lockupStakingAbi,
        functionName: enableEmergencyWithdraw ? "emergencyWithdraw" : "withdraw",
        args: enableEmergencyWithdraw ? [BigInt(type)] : [parseUnits(amount, decimals), BigInt(type)],
        value: enableEmergencyWithdraw ? "0" : performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };

      const receipt = await call_normalMethod(stakingContract, walletClient, client);

      dispatch(resetPendingReflection(sousId));
      dispatch(updatePoolsUserData({ sousId, field: "earnings", value: "0" }));
      dispatch(updateUserPendingReward(sousId, account, chainId));
      dispatch(updateUserBalance(sousId, account, chainId));
      dispatch(updateUserStakedBalance(sousId, account, chainId));
      return receipt;
    },
    [account, chainId, sousId, contractAddress, type, performanceFee, enableEmergencyWithdraw, dispatch, walletClient]
  );

  const handleHarvest = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: lockupStakingAbi,
      functionName: "claimReward",
      args: [BigInt(type)],
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
  }, [account, chainId, sousId, contractAddress, type, performanceFee, dispatch, walletClient]);

  const handleHarvestDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: lockupStakingAbi,
      functionName: "claimDividend",
      args: [BigInt(type)],
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
  }, [account, chainId, sousId, contractAddress, type, performanceFee, dispatch, walletClient]);

  const handleCompound = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: lockupStakingAbi,
      functionName: "compoundReward",
      args: [BigInt(type)],
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
  }, [account, chainId, sousId, contractAddress, type, performanceFee, dispatch, walletClient]);

  const handleCompoundDividend = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const stakingContract = {
      address: contractAddress,
      abi: lockupStakingAbi,
      functionName: "compoundDividend",
      args: [BigInt(type)],
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
  }, [account, chainId, sousId, contractAddress, type, performanceFee, dispatch, walletClient]);

  return {
    onStake: handleStake,
    onUnStake: handleUnStake,
    onReward: handleHarvest,
    onCompound: handleCompound,
    onDividend: handleHarvestDividend,
    onCompoundDividend: handleCompoundDividend,
  };
};

export default useLockupPool;

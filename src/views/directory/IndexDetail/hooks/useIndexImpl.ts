import { useCallback } from "react";
import { PublicClient, WalletClient, parseEther, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

import IndexImplAbi from "config/abi/indexes/indexImpl";
import IndexImplV2Abi from "config/abi/indexes/indexImpl_v2";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import {
  fetchIndexPublicDataAsync,
  updateUserBalance,
  updateUserDeployerNftInfo,
  updateUserIndexNftInfo,
  updateUserStakings,
} from "state/indexes";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const zapIn = async (indexContract, walletClient: WalletClient, client: PublicClient) => {
  const queries = await client.readContract({
    address: indexContract.address,
    abi: indexContract.abi,
    functionName: "precomputeZapIn",
    args: indexContract.args,
  });
  // if (token != zeroAddress && queries[0].adapters.length === 0) return;

  let trades = [];
  for (let i = 0; i < queries.length; i++) {
    // if (queries[i].adapters.length === 0) return;
    let amountOut = queries[i].amounts[queries[i].amounts.length - 1]
      ? (queries[i].amounts[queries[i].amounts.length - 1] * BigInt(9900)) / BigInt(10000)
      : 0;
    trades.push([queries[i].amounts[0] ?? 0, amountOut, queries[i].path, queries[i].adapters]);
  }

  indexContract.args = [...indexContract.args, trades];

  let gasLimit = await client.estimateContractGas(indexContract);
  gasLimit = calculateGasMargin(gasLimit);

  const txHash = await walletClient.writeContract({ ...indexContract, gas: gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const claimTokens = async (indexContract, category, walletClient: WalletClient, client: PublicClient) => {
  if (category > 0) {
    const queries = await client.readContract({
      address: indexContract.address,
      abi: indexContract.abi,
      functionName: "precomputeZapOut",
      args: [zeroAddress],
    });
    let trades = [];
    for (let i = 0; i < queries.length - 1; i++) {
      trades.push([0, 0, queries[i].path, queries[i].adapters]);
    }

    indexContract.args = [...indexContract.args, trades];
  }

  let gasLimit = await client.estimateContractGas(indexContract);
  gasLimit = calculateGasMargin(gasLimit);

  const txHash = await walletClient.writeContract({ ...indexContract, gas: gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const zapOut = async (indexContract, walletClient: WalletClient, client: PublicClient) => {
  const queries = await client.readContract({
    address: indexContract.address,
    abi: indexContract.abi,
    functionName: "precomputeZapOut",
    args: [indexContract.args[0]],
  });

  // if (token != zeroAddress && queries[queries.length - 1].adapters.length === 0) return;

  let trades = [];
  for (let i = 0; i < queries.length; i++) {
    // if (queries[i].adapters.length === 0) return;

    let amountOut = queries[i].amounts[queries[i].amounts.length - 1]
      ? (queries[i].amounts[queries[i].amounts.length - 1] * BigInt(9900)) / BigInt(10000)
      : 0;
    trades.push([queries[i].amounts[0] ?? 0, amountOut, queries[i].path, queries[i].adapters]);
  }
  indexContract.args = [...indexContract.args, trades];

  let gasLimit = await client.estimateContractGas(indexContract);
  gasLimit = calculateGasMargin(gasLimit);

  const txHash = await walletClient.writeContract({ ...indexContract, gas: gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const call_normalMethod = async (indexContract, walletClient: WalletClient, client: PublicClient) => {
  let gasLimit = await client.estimateContractGas(indexContract);
  gasLimit = calculateGasMargin(gasLimit);

  const txHash = await walletClient.writeContract({ ...indexContract, gas: gasLimit });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useIndexImpl = (pid, contractAddress, version, performanceFee) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: walletClient } = useWalletClient();

  const handleZapIn = useCallback(
    async (token, amount, percents) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
        functionName: "zapIn",
        args: [token, parseEther(amount), percents.map((p) => BigInt((p * 100).toFixed(0)))],
        value: token === zeroAddress ? parseEther(amount) : 0,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await zapIn(indexContract, walletClient, client);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, pid, contractAddress, version, dispatch, walletClient]
  );

  const handleZapOut = useCallback(
    async (token) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
        functionName: "zapOut",
        args: [token],
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await zapOut(indexContract, walletClient, client);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, pid, contractAddress, version, dispatch, walletClient]
  );

  const handleClaim = useCallback(
    async (percent) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
        functionName: "claimTokens",
        args: [BigInt((percent * 100).toFixed(0))],
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await claimTokens(indexContract, version, walletClient, client);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, pid, contractAddress, version, dispatch, walletClient]
  );

  const handleMintNft = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(chainId);

    let indexContract = {
      address: contractAddress as `0x${string}`,
      abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
      functionName: "mintNft",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(indexContract, walletClient, client);

    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserIndexNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, pid, contractAddress, version, performanceFee, dispatch, walletClient]);

  const handleStakeNft = useCallback(
    async (tokenId) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
        functionName: "stakeNft",
        args: [BigInt(tokenId)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await call_normalMethod(indexContract, walletClient, client);

      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      dispatch(updateUserIndexNftInfo(account, chainId));
      return receipt;
    },
    [account, chainId, pid, contractAddress, version, performanceFee, dispatch, walletClient]
  );

  const handleMintDeployerNft = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(chainId);

    let indexContract = {
      address: contractAddress as `0x${string}`,
      abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
      functionName: "mintDeployerNft",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(indexContract, walletClient, client);

    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, contractAddress, version, performanceFee, dispatch, walletClient]);

  const handleStaketDeployerNft = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(chainId);

    let indexContract = {
      address: contractAddress as `0x${string}`,
      abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
      functionName: "stakeDeployerNft",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(indexContract, walletClient, client);

    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, contractAddress, version, performanceFee, dispatch, walletClient]);

  const handleUnstaketDeployerNft = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(chainId);

    let indexContract = {
      address: contractAddress as `0x${string}`,
      abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
      functionName: "unstakeDeployerNft",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(indexContract, walletClient, client);

    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, contractAddress, version, performanceFee, dispatch, walletClient]);

  const handleUpdateFeeAddresss = useCallback(
    async (wallet) => {
      const client = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: version > "V1" ? IndexImplV2Abi : IndexImplAbi,
        functionName: "setFeeWallet",
        args: [wallet],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await call_normalMethod(indexContract, walletClient, client);

      dispatch(updateUserBalance(account, chainId));
      dispatch(updateUserDeployerNftInfo(account, chainId));
      return receipt;
    },
    [account, chainId, contractAddress, version, performanceFee, dispatch, walletClient]
  );

  return {
    onZapIn: handleZapIn,
    onClaim: handleClaim,
    onZapOut: handleZapOut,
    onMintNft: handleMintNft,
    onStakeNft: handleStakeNft,
    onMintDeployerNft: handleMintDeployerNft,
    onStakeDeployerNft: handleStaketDeployerNft,
    onUnstakeDeployerNft: handleUnstaketDeployerNft,
    onUpdateFeeAddress: handleUpdateFeeAddresss,
  };
};

export default useIndexImpl;

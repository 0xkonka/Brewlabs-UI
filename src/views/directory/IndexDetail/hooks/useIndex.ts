import { useCallback } from "react";
import { PublicClient, WalletClient, parseEther } from "viem";
import { useWalletClient } from "wagmi";

import IndexAbi from "config/abi/indexes/index";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import { fetchIndexPublicDataAsync, updateUserBalance, updateUserStakings } from "state/indexes";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const call_normalMethod = async (indexContract, walletClient: WalletClient, publicClient: PublicClient) => {
  let gasLimit = await publicClient.estimateContractGas(indexContract);
  gasLimit = (gasLimit * BigInt(12000)) / BigInt(10000);

  const txHash = await walletClient.writeContract({ ...indexContract, gas: gasLimit });
  return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useIndex = (pid, contractAddress, performanceFee) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: walletClient } = useWalletClient();

  const handleZapIn = useCallback(
    async (amount, percents) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(publicClient, chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: IndexAbi,
        functionName: "zapIn",
        args: [parseEther(amount), percents.map((p) => BigInt(Math.floor(p * 100)))],
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await call_normalMethod(indexContract, walletClient, publicClient);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, pid, chainId, contractAddress, dispatch, walletClient]
  );

  const handleZapOut = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let indexContract = {
      address: contractAddress as `0x${string}`,
      abi: IndexAbi,
      functionName: "zapOut",
      args: [],
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(indexContract, walletClient, publicClient);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    return receipt;
  }, [account, pid, chainId, contractAddress, dispatch, walletClient]);

  const handleClaim = useCallback(
    async (percent) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(publicClient, chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: IndexAbi,
        functionName: "claimTokens",
        args: [BigInt(Math.floor(percent * 100))],
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await call_normalMethod(indexContract, walletClient, publicClient);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, pid, chainId, contractAddress, dispatch, walletClient]
  );

  const handleMintNft = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    let indexContract = {
      address: contractAddress as `0x${string}`,
      abi: IndexAbi,
      functionName: "mintNft",
      args: [],
      value: performanceFee,
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    };
    const receipt = await call_normalMethod(indexContract, walletClient, publicClient);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    return receipt;
  }, [account, pid, chainId, contractAddress, performanceFee, dispatch, walletClient]);

  const handleStakeNft = useCallback(
    async (tokenId) => {
      const publicClient = getViemClients({ chainId });
      const gasPrice = await getNetworkGasPrice(publicClient, chainId);

      let indexContract = {
        address: contractAddress as `0x${string}`,
        abi: IndexAbi,
        functionName: "stakeNft",
        args: [BigInt(tokenId)],
        value: performanceFee,
        account: walletClient.account,
        chain: walletClient.chain,
        gasPrice,
      };
      const receipt = await call_normalMethod(indexContract, walletClient, publicClient);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, pid, chainId, contractAddress, performanceFee, dispatch, walletClient]
  );

  return {
    onZapIn: handleZapIn,
    onClaim: handleClaim,
    onZapOut: handleZapOut,
    onMintNft: handleMintNft,
    onStakeNft: handleStakeNft,
  };
};

export default useIndex;

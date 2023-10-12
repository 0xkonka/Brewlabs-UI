import { useCallback } from "react";
import { parseEther } from "viem";
import { erc20ABI, useWalletClient } from "wagmi";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import { updateUserAllowance } from "state/pools";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const useApprovePool = (tokenAddress, sousId, contractAddress) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: walletClient } = useWalletClient();

  const handleApprove = useCallback(async () => {
    const publicClient = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(publicClient, chainId);

    const txHash = await walletClient.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [contractAddress as `0x${string}`, parseEther("100000000000000")],
      account: walletClient.account,
      chain: walletClient.chain,
      gasPrice,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });

    dispatch(updateUserAllowance(sousId, account, chainId));
    return receipt;
  }, [account, chainId, contractAddress, sousId, tokenAddress, dispatch, walletClient]);

  return { onApprove: handleApprove };
};

export default useApprovePool;

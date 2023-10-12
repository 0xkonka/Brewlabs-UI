import { useCallback } from "react";
import { parseEther } from "viem";
import { erc20ABI, useWalletClient } from "wagmi";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

const useApproveFarm = (tokenAddress, pid, contractAddress) => {
  const dispatch = useAppDispatch();
  const { account, chainId } = useActiveWeb3React();
  const { data: walletClient } = useWalletClient();

  const handleApprove = useCallback(async () => {
    const client = getViemClients({ chainId });
    const gasPrice = await getNetworkGasPrice(client, chainId);

    const txHash = await walletClient.writeContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "approve",
      args: [contractAddress as `0x${string}`, parseEther("10000000000000")],
      account,
      chain: walletClient.chain,
      gasPrice,
    });

    const receipt = await client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });

    dispatch(fetchFarmUserDataAsync({ account, chainId, pids: [pid] }));
    return receipt;
  }, [account, chainId, tokenAddress, contractAddress, pid, dispatch, walletClient]);

  return { onApprove: handleApprove };
};

export default useApproveFarm;

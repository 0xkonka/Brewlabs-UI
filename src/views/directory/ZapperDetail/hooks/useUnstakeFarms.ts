import { useCallback } from "react";
import { Address, parseEther } from "viem";

import { Chef } from "config/constants/types";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useExternalMasterchef } from "hooks/useContract";
import { calculateGasMargin } from "utils";
import { getExternalMasterChefContract } from "utils/contractHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

type MasterChefContract = ReturnType<typeof getExternalMasterChefContract>;
const unstakeFarm = async (
  masterChefContract: MasterChefContract,
  pid: number,
  amount: string,
  earningTokenAddress: Address,
  performanceFee: bigint,
  gasPrice: string
) => {
  const value = parseEther(amount);
  let gasLimit = await masterChefContract.estimateGas.zapOut([pid, value, earningTokenAddress], {
    value: performanceFee,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  });
  gasLimit = calculateGasMargin(gasLimit);

  const txHash = await masterChefContract.write.zapOut([pid, value, earningTokenAddress], {
    gasPrice,
    gasLimit,
    value: performanceFee,
  });
  const client = getViemClients({ chainId: masterChefContract.chain.id });

  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useUnstakeFarms = (chef = Chef.MASTERCHEF, pid: number, earningTokenAddress: string, performanceFee: bigint) => {
  const { chainId } = useActiveChainId();
  const masterChefContract = useExternalMasterchef(chef);

  const handleUnstake = useCallback(
    async (amount: string) => {
      const gasPrice = await getNetworkGasPrice(chainId);
      await unstakeFarm(masterChefContract, pid, amount, earningTokenAddress as Address, performanceFee, gasPrice);
    },
    [masterChefContract, pid, earningTokenAddress, chainId, performanceFee]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;

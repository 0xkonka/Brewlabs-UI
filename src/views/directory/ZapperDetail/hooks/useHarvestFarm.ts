import { useCallback } from "react";
import { Chef } from "config/constants/types";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useExternalMasterchef } from "hooks/useContract";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

import { RewardType } from "../types";

const harvestFarm = async (
  masterChefContract: any,
  pid: number,
  reward: string,
  performanceFee: string,
  gasPrice: string
) => {
  let gasLimit = await masterChefContract.estimateGas.zapOut([pid, "0", reward], {
    value: performanceFee,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.write.zapOut([pid, "0", reward], { gasPrice, gasLimit, value: performanceFee });
  const client = getViemClients({ chainId: masterChefContract.chain.id });
  return client.waitForTransactionReceipt({ hash: tx, confirmations: 2 });
};

const useHarvestFarm = (chef = Chef.MASTERCHEF, pid: number, earningTokens: string[]) => {
  const { chainId } = useActiveChainId();
  const masterChefContract = useExternalMasterchef(chef);

  const handleHarvest = useCallback(
    async (rewardType: RewardType) => {
      const gasPrice = await getNetworkGasPrice(chainId);
      const performanceFee: any = await masterChefContract.read.feeAmount([]);
      await harvestFarm(masterChefContract, pid, earningTokens[rewardType], performanceFee, gasPrice);
    },
    [pid, masterChefContract, chainId, earningTokens]
  );

  return {
    onReward: handleHarvest,
  };
};

export default useHarvestFarm;

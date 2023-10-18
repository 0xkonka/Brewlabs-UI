import { Currency } from "@brewlabs/sdk";
import { useCallback, useMemo } from "react";
import { Address, parseUnits, zeroAddress } from "viem";
import useSWR from "swr";

import { Chef } from "config/constants/types";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useExternalMasterchef } from "hooks/useContract";
import { calculateGasMargin } from "utils";
import { getExternalMasterChefContract } from "utils/contractHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { useAppId } from "state/zap/hooks";
import { getViemClients } from "utils/viem";

type MasterChefContract = ReturnType<typeof getExternalMasterChefContract>;

const stakeFarm = async (
  currency: Currency,
  masterChefContract: MasterChefContract,
  lpAddress: Address,
  pid: number,
  tokenAddress: Address,
  amount: string,
  performanceFee: bigint,
  gasPrice: string
) => {
  const _amount = parseUnits(amount, currency?.decimals ?? 18);
  const value = currency.isNative ? _amount + performanceFee : performanceFee;

  let gasLimit = await masterChefContract.estimateGas.zapIn(
    [currency.isNative ? zeroAddress : currency.address, lpAddress, pid, _amount, 0, tokenAddress],
    { value, account: masterChefContract.account, chain: masterChefContract.chain }
  );
  gasLimit = calculateGasMargin(gasLimit);

  const txHash = await masterChefContract.write.zapIn(
    [currency.isNative ? zeroAddress : currency.address, lpAddress, pid, _amount, 0, tokenAddress],
    { gasPrice, gasLimit, value }
  );
  const client = getViemClients({ chainId: currency.chainId });
  return client.waitForTransactionReceipt({ hash: txHash, confirmations: 2 });
};

const useStakeFarms = (
  chef = Chef.MASTERCHEF,
  lpAddress: string,
  pid: number,
  earningTokenAddress: string,
  performanceFee: bigint
) => {
  const { chainId } = useActiveChainId();
  const masterChefContract = useExternalMasterchef(chef);

  const handleStake = useCallback(
    async (currency: Currency, amount: string) => {
      const gasPrice = await getNetworkGasPrice(chainId);
      await stakeFarm(
        currency,
        masterChefContract,
        lpAddress as Address,
        pid,
        earningTokenAddress as Address,
        amount,
        performanceFee,
        gasPrice
      );
    },
    [masterChefContract, lpAddress, pid, chainId, earningTokenAddress, performanceFee]
  );

  return { onStake: handleStake };
};

export const usePerformanceFee = (chainId) => {
  const [appId] = useAppId();

  const masterChefContract = useMemo(() => getExternalMasterChefContract(chainId, appId), [chainId, appId]);

  const { data } = useSWR([appId, "farmsReward"], async () => {
    const performanceFee = await masterChefContract.read.feeAmount([]);
    return performanceFee;
  });
  return (data ? data : BigInt(0)) as bigint;
};

export default useStakeFarms;

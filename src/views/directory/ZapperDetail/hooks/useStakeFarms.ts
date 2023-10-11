import { Currency } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

import { Chef } from "config/constants/types";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useExternalMasterchef } from "hooks/useContract";
import { calculateGasMargin } from "utils";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import { getExternalMasterChefContract } from "utils/contractHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { useAppId } from "state/zap/hooks";
import { ethers } from "ethers";

const stakeFarm = async (
  currency,
  masterChefContract,
  lpAddress,
  pid,
  tokenAddress,
  amount,
  performanceFee,
  gasPrice
) => {
  const _amount = new BigNumber(amount).times(10**(currency?.decimals ?? 18));
  const value = currency.isNative ? _amount.plus(performanceFee).toString() : performanceFee.toString();

  let gasLimit = await masterChefContract.estimateGas.zapIn(
    currency.isNative ? ethers.constants.AddressZero : currency.address,
    lpAddress,
    pid,
    _amount.toString(),
    0,
    tokenAddress,
    { value }
  );
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await masterChefContract.zapIn(
    currency.isNative ? ethers.constants.AddressZero : currency.address,
    lpAddress,
    pid,
    _amount.toString(),
    0,
    tokenAddress,
    { gasPrice, gasLimit, value }
  );
  const receipt = await tx.wait();
  return receipt.status;
};

const useStakeFarms = (
  chef = Chef.MASTERCHEF,
  lpAddress: string,
  pid: number,
  earningTokenAddress: string,
  performanceFee: BigNumber
) => {
  const { chainId, library } = useActiveWeb3React();
  const masterChefContract = useExternalMasterchef(true, chef);

  const handleStake = useCallback(
    async (currency: Currency, amount: string) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      await stakeFarm(
        currency,
        masterChefContract,
        lpAddress,
        pid,
        earningTokenAddress,
        amount,
        performanceFee,
        gasPrice
      );
    },
    [masterChefContract, lpAddress, pid, chainId, earningTokenAddress, library, performanceFee]
  );

  return { onStake: handleStake };
};

export const usePerformanceFee = (chainId) => {
  const [appId] = useAppId();
  const masterChefContract = useMemo(() => getExternalMasterChefContract(chainId, appId), [chainId, appId]);
  const { data } = useSWR([appId, "farmsReward"], async () => {
    const performanceFee = await masterChefContract.feeAmount();
    return performanceFee;
  });
  return data ? new BigNumber(data._hex) : new BigNumber(0);
};

export default useStakeFarms;

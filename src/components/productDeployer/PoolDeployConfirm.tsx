import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { NETWORKS } from "config/constants/networks";

import { getChainLogo } from "utils/functions";
import { numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { useActiveChainId } from "hooks/useActiveChainId";

import TokenLogo from "@components/logo/TokenLogo";
import { Button } from "components/ui/button";
import type { DeployStep } from "@components/DeployProgress";
import DeployProgress, { updateDeployStatus } from "@components/DeployProgress";

import { useDeployerPoolState, setDeployerPoolStep, setDeployedPoolAddress } from "state/deploy/deployerPool.store";
import { usePoolFactoryState } from "state/deploy/hooks";
import { usePoolFactory } from "@hooks/deploy/useDeployPool";
import { useTokenApprove } from "@hooks/useApprove";
import { BLOCKS_PER_DAY2 } from "config/constants";
import { useCurrency } from "@hooks/Tokens";
import useTotalSupply from "@hooks/useTotalSupply";
import { Token } from "@brewlabs/sdk";
import PoolFactoryAbi from "config/abi/staking/brewlabsPoolFactory.json";
import stakingAbi from "config/abi/staking/stakingImpl.json";
import { getNativeSymbol, handleWalletError } from "lib/bridge/helpers";
import { usePoolFactoryContract } from "@hooks/useContract";
import { useSigner } from "utils/wagmi";
import { getContract, getBep20Contract } from "utils/contractHelpers";

const initialDeploySteps = [
  {
    name: "Deploy staking pool",
    status: "current",
    description: "Confirm contract creation in your wallet",
  },
  {
    name: "Supply reward tokens",
    status: "upcoming",
    description: "Transfer of designated reward token amount ",
  },
  {
    name: "Starting pool",
    status: "upcoming",
    description: "Launching the pool",
  },
] as DeployStep[];

const PoolDeployConfirm = () => {
  const { chainId } = useActiveChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState(initialDeploySteps);
  const factoryState = usePoolFactoryState(chainId);
  const poolFactoryContract = usePoolFactoryContract(chainId);
  const { onApprove } = useTokenApprove();
  const { data: signer } = useSigner();
  const [
    {
      poolToken,
      poolDeployChainId,
      poolDuration,
      poolDepositFee,
      poolWithdrawFee,
      poolLockPeriod,
      poolReflectionToken,
      poolRewardToken,
      poolInitialRewardSupply,
    },
  ] = useDeployerPoolState("poolInfo");

  const rewardCurrency = useCurrency(poolRewardToken?.address);
  const totalSupply = useTotalSupply(rewardCurrency as Token) || 0;

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = useCallback(async () => {
    if (chainId !== poolDeployChainId) {
      toast.error("Connected chain is not the same as the selected deploy chain");
      return;
    }

    // Restore initial deploy steps
    setDeploySteps(initialDeploySteps);
    // Shows initial the deployment progress
    setIsDeploying(true);
    const rewardTokenContract = getBep20Contract(chainId, poolRewardToken?.address, signer);
    try {
      let rewardPerBlock = ethers.utils.parseUnits(
        ((+totalSupply.toFixed(2) * poolInitialRewardSupply) / 100).toFixed(poolRewardToken.decimals),
        poolRewardToken.decimals
      );
      rewardPerBlock = rewardPerBlock
        .div(ethers.BigNumber.from(Number(poolDuration)))
        .div(ethers.BigNumber.from(BLOCKS_PER_DAY2[chainId]));

      const hasDividend = false;
      const dividendToken = ethers.constants.AddressZero;

      // Approve paying token for deployment
      if (factoryState.payingToken.isToken && +factoryState.serviceFee > 0) {
        await onApprove(factoryState.payingToken.address, factoryState.address);
      }

      // Complete 1st step
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploy staking pool",
        updatedStatus: "current",
      });

      // Deploy farm contract
      let tx;
      if (Number(poolLockPeriod) > 0) {
        const pendingTx = await poolFactoryContract.createBrewlabsLockupPools(
          poolToken.address,
          poolRewardToken.address,
          dividendToken,
          Number(poolDuration),
          [Number(poolLockPeriod) * 30],
          [rewardPerBlock.toString()],
          [(poolDepositFee * 100).toFixed(0)],
          [(poolWithdrawFee * 100).toFixed(0)],
          { value: factoryState.serviceFee }
        );
        tx = await pendingTx.wait();
      } else {
        const pendingTx = await poolFactoryContract.createBrewlabsSinglePool(
          poolToken.address,
          poolRewardToken.address,
          dividendToken,
          Number(poolDuration),
          rewardPerBlock.toString(),
          (poolDepositFee * 100).toFixed(0),
          (poolWithdrawFee * 100).toFixed(0),
          hasDividend,
          { value: factoryState.serviceFee }
        );
        tx = await pendingTx.wait();
      }
      // Complete 2nd step
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploy staking pool",
        updatedStatus: "complete",
      });
      // Change status of 3rd step
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Supply reward tokens",
        updatedStatus: "current",
      });

      // let pool = "";
      let poolAddress = "";
      const iface = new ethers.utils.Interface(PoolFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "SinglePoolCreated" || log.name === "LockupPoolCreated") {
            poolAddress = log.args.pool;
            setDeployedPoolAddress(log.args.pool);
            break;
          }
        } catch (e) { }
      }
      const poolContract = getContract(chainId, poolAddress, stakingAbi, signer);
      const rewardAmount = await poolContract.insufficientRewards();
      const transferPendingTx = await rewardTokenContract.transfer(poolContract.address, rewardAmount);
      await transferPendingTx.wait();

      // Complete 3rd step
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Supply reward tokens",
        updatedStatus: "complete",
      });
      // Change status of 4th step
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Starting pool",
        updatedStatus: "current",
      });
      const pendingStartTx = await poolContract.startReward();
      await pendingStartTx.wait();
      const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
      await sleep(30000);
      // When all steps are complete the success step will be shown
      // See the onSuccess prop in the DeployProgress component for more details

      // Complete 4th step
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Starting pool",
        updatedStatus: "complete",
      });
    } catch (e) {
      handleWalletError(e, showError, getNativeSymbol(chainId));
      // Error deploying farm contract
      const currentStep = deploySteps.find((step) => step.status === "current");
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: currentStep.name,
        updatedStatus: "failed",
        updatedDescription: "Deployment failed",
      });
    }
  }, [chainId, deploySteps, signer, onApprove, factoryState, poolDeployChainId, poolDepositFee, poolDuration, poolFactoryContract, poolInitialRewardSupply, poolLockPeriod, poolReflectionToken, poolToken.address, poolWithdrawFee, totalSupply]);


  return (
    <div className="mx-auto my-8 max-w-2xl animate-in fade-in slide-in-from-right">
      {isDeploying && (
        <DeployProgress
          deploySteps={deploySteps}
          onError={() => setIsDeploying(false)}
          onSuccess={() => {
            setIsDeploying(false);
            setDeployerPoolStep("success");
          }}
        />
      )}

      {!isDeploying && (
        <>
          <h2 className="mb-6 text-xl">Confirm and deploy staking pool</h2>
          <p className="my-2 text-gray-400">
            You are about to deploy a new staking pool on the {NETWORKS[poolDeployChainId].chainName} network.
          </p>

          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Pool token</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <TokenLogo
                    alt={poolToken.name}
                    classNames="h-7 w-7"
                    src={getTokenLogoURL(poolToken.address, poolToken.chainId, poolToken.logo)}
                  />
                  {poolToken.name} - {poolToken.symbol}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Deploying on</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <img
                    src={getChainLogo(poolDeployChainId)}
                    alt={NETWORKS[poolDeployChainId].chainName}
                    className="h-7 w-7"
                  />
                  {NETWORKS[poolDeployChainId].chainName}
                </dd>
              </div>
              {poolRewardToken && (
                <>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-white">Reward token</dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                      <TokenLogo
                        alt={poolRewardToken.name}
                        classNames="h-7 w-7"
                        src={getTokenLogoURL(poolRewardToken.address, poolRewardToken.chainId, poolRewardToken.logo)}
                      />
                      {poolRewardToken.name} - {poolRewardToken.symbol}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-white">Reward tokens required</dt>
                    <dd className="mt-1 flex flex-col justify-start gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                      <p className=" text-gray-200 underline">
                        {numberWithCommas(((+totalSupply.toFixed(2) * poolInitialRewardSupply) / 100).toFixed(2))}{" "}
                        {poolRewardToken.name}
                      </p>
                      <p className="text-xs">
                        Total {poolRewardToken.name} token supply: {numberWithCommas(totalSupply.toFixed(2))} *{" "}
                        {poolInitialRewardSupply}%
                      </p>
                    </dd>
                  </div>
                </>
              )}
              {poolReflectionToken && (
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-white">Reflection token</dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                    <TokenLogo
                      alt={poolReflectionToken.name}
                      classNames="h-7 w-7"
                      src={getTokenLogoURL(
                        poolReflectionToken.address,
                        poolReflectionToken.chainId,
                        poolReflectionToken.logo
                      )}
                    />
                    {poolReflectionToken.name} - {poolReflectionToken.symbol}
                  </dd>
                </div>
              )}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Staking pool duration</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {poolDuration} days
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Staking pool lock period</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {poolLockPeriod === "0" ? "Not locked" : `${poolLockPeriod} months`}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Withdraw fee</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {poolWithdrawFee}%
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Deposit fee</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {poolDepositFee}%
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center gap-2"
              onClick={() => setDeployerPoolStep("details")}
            >
              Edit
            </Button>

            <Button type="button" onClick={() => handleDeploy()} variant="brand" className="w-full">
              Deploy
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PoolDeployConfirm;

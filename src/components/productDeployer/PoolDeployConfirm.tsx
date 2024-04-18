import { useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

import { NETWORKS } from "config/constants/networks";

import { getChainLogo } from "utils/functions";

import { useActiveChainId } from "hooks/useActiveChainId";

import getTokenLogoURL from "utils/getTokenLogoURL";

import TokenLogo from "@components/logo/TokenLogo";
import { Button } from "components/ui/button";

import type { DeployStep } from "@components/DeployProgress";
import DeployProgress, { updateDeployStatus } from "@components/DeployProgress";

import { useDeployerPoolState, setDeployerPoolStep, setDeployedPoolAddress } from "state/deploy/deployerPool.store";
import { usePoolFactoryState } from "state/deploy/hooks";
import { usePoolFactory } from "@hooks/deploy/useDeployPool";
import { useTokenApprove } from "@hooks/useApprove";
import { ethers } from "ethers";
import { BLOCKS_PER_DAY2 } from "config/constants";
import { useCurrency } from "@hooks/Tokens";
import useTotalSupply from "@hooks/useTotalSupply";
import { Token } from "@brewlabs/sdk";
import PoolFactoryAbi from "config/abi/staking/brewlabsPoolFactory.json";
import { getNativeSymbol, handleWalletError } from "lib/bridge/helpers";


const initialDeploySteps = [
  {
    name: "Waiting",
    status: "current",
    description: "Approve transaction to deploy staking pool",
  },
  {
    name: "Deploying",
    status: "upcoming",
    description: "Deploying staking pool",
  },
  {
    name: "Completed",
    status: "upcoming",
    description: "Index successfully deployed",
  },
] as DeployStep[];

const PoolDeployConfirm = () => {
  const { chainId } = useActiveChainId();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState(initialDeploySteps);
  const factoryState = usePoolFactoryState(chainId);
  const { onCreateSinglePool, onCreateLockupPool, onCreateLockupPoolWithPenalty } = usePoolFactory(chainId, factoryState.serviceFee);
  const { onApprove } = useTokenApprove();
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

  const handleDeploy = async () => {
    if (chainId !== poolDeployChainId) {
      toast.error("Connected chain is not the same as the selected deploy chain");
      return;
    }

    // Restore initial deploy steps
    setDeploySteps(initialDeploySteps);
    // Shows initial the deployment progress
    setIsDeploying(true);
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
        updateDeployStatus({
          setStepsFn: setDeploySteps,
          targetStep: "Waiting",
          updatedStatus: "complete",
          updatedDescription: "Approved transaction to deploy pool",
        });

        updateDeployStatus({
          setStepsFn: setDeploySteps,
          targetStep: "Deploying",
          updatedStatus: "current",
          updatedDescription: "Deployment in progress",
        });
      }

      // Deploy farm contract
      let tx;
      console.log(poolDuration, poolLockPeriod);
      if (Number(poolLockPeriod) > 0) {
        tx = await onCreateLockupPool(
          poolToken.address,
          poolRewardToken.address,
          dividendToken,
          Number(poolDuration),
          [Number(poolLockPeriod)],
          [rewardPerBlock.toString()],
          [(poolDepositFee * 100).toFixed(0)],
          [(poolWithdrawFee * 100).toFixed(0)],
        );
      }
      else {
        tx = await onCreateSinglePool(
          poolToken.address,
          poolRewardToken.address,
          dividendToken,
          Number(poolDuration),
          rewardPerBlock.toString(),
          (poolDepositFee * 100).toFixed(0),
          (poolWithdrawFee * 100).toFixed(0),
          hasDividend
        );
      }
      let pool = "";
      const iface = new ethers.utils.Interface(PoolFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "SinglePoolCreated") {
            pool = log.args.pool;
            setDeployedPoolAddress(log.args.pool);
            break;
          }
        } catch (e) { }
      }

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "complete",
        updatedDescription: "Deployment done",
      });

    } catch (e) {
      handleWalletError(e, showError, getNativeSymbol(chainId));
      // Error deploying farm contract
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "failed",
        updatedDescription: "Deployment failed",
      });
    }

    // setTimeout(() => {
    //   updateDeployStatus({
    //     setStepsFn: setDeploySteps,
    //     targetStep: "Waiting",
    //     updatedStatus: "complete",
    //     updatedDescription: "Approved transaction to deploy pool",
    //   });
    // }, 2000);

    // setTimeout(() => {
    //   updateDeployStatus({
    //     setStepsFn: setDeploySteps,
    //     targetStep: "Deploying",
    //     updatedStatus: "current",
    //     updatedDescription: "Deployment in progress",
    //   });
    // }, 4000);

    // setTimeout(() => {
    //   updateDeployStatus({
    //     setStepsFn: setDeploySteps,
    //     targetStep: "Deploying",
    //     updatedStatus: "complete",
    //     updatedDescription: "Deployment done",
    //   });

    //   updateDeployStatus({
    //     setStepsFn: setDeploySteps,
    //     targetStep: "Completed",
    //     updatedStatus: "complete",
    //     updatedDescription: "Deployment done",
    //   });
    // }, 6000);

    // setTimeout(() => {
    //   setDeployerPoolStep("success");
    // }, 9000);

    // When all steps are complete the success step will be shown
    // See the onSuccess prop in the DeployProgress component for more details
  };

  return (
    <div className="mx-auto my-8 max-w-2xl animate-in fade-in slide-in-from-right">
      {isDeploying && (
        <DeployProgress
          deploySteps={deploySteps}
          onError={() => setIsDeploying(false)}
          onSuccess={() => setDeployerPoolStep("success")}
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

import { useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { ethers } from "ethers";

import { NETWORKS } from "config/constants/networks";
import IndexFactoryAbi from "config/abi/indexes/factory.json";

import { getChainLogo } from "utils/functions";
import { getBep20Contract } from "utils/contractHelpers";
import { getNativeSymbol, handleWalletError } from "lib/bridge/helpers";

import { useTokenApprove } from "hooks/useApprove";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useIndexFactory } from "state/deploy/hooks";
import { useDeployIndex } from "hooks/deploy/useDeployIndex";

import { Button } from "components/ui/button";
import IndexLogo from "components/logo/IndexLogo";
import type { DeployStep } from "@components/DeployProgress";
import DeployProgress, { updateDeployStatus } from "@components/DeployProgress";

import { useDeployerIndexState, setDeployerIndexStep, setDeployedIndexAddress } from "state/deploy/deployerIndex.store";

const initialDeploySteps = [
  {
    name: "Waiting",
    status: "current",
    description: "Approve transaction to deploy index",
  },
  {
    name: "Deploying",
    status: "upcoming",
    description: "Deploying index",
  },
  {
    name: "Completed",
    status: "upcoming",
    description: "Index successfully deployed",
  },
] as DeployStep[];

const IndexDeployConfirm = () => {
  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState(initialDeploySteps);

  const [indexTokens] = useDeployerIndexState("indexTokens");
  const [{ indexDeployChainId, indexName, commissionWallet, commissionFee, depositFee, isPrivate }] =
    useDeployerIndexState("indexInfo");

  const { onApprove } = useTokenApprove();
  const factory = useIndexFactory(chainId);
  const { onCreate } = useDeployIndex(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = async () => {
    if (chainId !== indexDeployChainId) {
      toast.error("Connected chain is not the same as the selected deploy chain");
      return;
    }

    if (!factory) {
      toast.error("Not supported current chain");
      return;
    }

    // Restore initial deploy steps
    setDeploySteps(initialDeploySteps);
    // Shows initial the deployment progress
    setIsDeploying(true);

    try {
      if (factory.payingToken.isToken && +factory.serviceFee > 0) {
        const payingToken = getBep20Contract(chainId, factory.payingToken.address);
        const allowance = await payingToken.allowance(account, factory.address);

        // Approve paying token for deployment
        if (
          factory.payingToken.isToken &&
          +factory.serviceFee > 0 &&
          allowance.lt(ethers.BigNumber.from(factory.serviceFee))
        ) {
          await onApprove(factory.payingToken.address, factory.address);
          updateDeployStatus({
            setStepsFn: setDeploySteps,
            targetStep: "Waiting",
            updatedStatus: "complete",
            updatedDescription: "Transaction approved",
          });
        }
      }

      // Deploy farm contract
      const tx = await onCreate(
        indexName,
        indexTokens.map((t) => t.address),
        [depositFee, commissionFee],
        commissionWallet,
        isPrivate
      );

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "current",
        updatedDescription: "Deployment in progress",
      });

      const iface = new ethers.utils.Interface(IndexFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "IndexCreated") {
            setDeployedIndexAddress(log.args.index);
            break;
          }
        } catch (e) {}
      }

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "complete",
        updatedDescription: "Deployment done",
      });
      // When all steps are complete the success step will be shown
      // See the onSuccess prop in the DeployProgress component for more details
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Completed",
        updatedStatus: "complete",
      });
    } catch (e) {
      handleWalletError(e, showError, getNativeSymbol(chainId));
      // Error deploying farm contract
      const currentStep = deploySteps.find((step) => step.status === "current");
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: currentStep?.name,
        updatedStatus: "failed",
        updatedDescription: "Deployment failed",
      });
    }
  };

  return (
    <div className="mx-auto my-8 max-w-2xl animate-in fade-in slide-in-from-right">
      {isDeploying && (
        <DeployProgress
          deploySteps={deploySteps}
          onError={() => setIsDeploying(false)}
          onSuccess={() => {
            setIsDeploying(false);
            setDeployerIndexStep("success");
          }}
        />
      )}

      {!isDeploying && (
        <>
          <h2 className="mb-6 text-xl">Confirm and deploy index</h2>
          <p className="my-2 text-gray-400">
            You are about to deploy a new index on the {NETWORKS[indexDeployChainId].chainName} network.
          </p>
          <p className="my-2 text-gray-400">Please confirm the details.</p>

          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Index name</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <IndexLogo type="line" tokens={indexTokens} classNames="mx-3" />
                  {indexName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Deploying on</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <img
                    src={getChainLogo(indexDeployChainId)}
                    alt={NETWORKS[indexDeployChainId].chainName}
                    className="h-7 w-7"
                  />
                  {NETWORKS[indexDeployChainId].chainName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Fee receiver wallet</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{commissionWallet}</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Commission fee</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{commissionFee}%</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Deposit fee</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">{depositFee}%</dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Public index</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  {isPrivate ? "Is private" : "Is public"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center gap-2"
              onClick={() => setDeployerIndexStep("details")}
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

export default IndexDeployConfirm;

import { Dispatch, SetStateAction } from "react";
import { ethers } from "ethers";
import { formatEther } from "viem";

import { Button } from "components/ui/button";
import type { DeployStep } from "@components/DeployProgress";
import { updateDeployStatus } from "@components/DeployProgress";

import { useTokenFactory } from "state/deploy/hooks";
import { useDeployerTokenState, setDeployerTokenStep, setDeployedAddress } from "state/deploy/deployerToken.store";
import { useFactory } from "hooks/useFactory";
import { useActiveChainId } from "hooks/useActiveChainId";

import { getNativeSymbol } from "lib/bridge/helpers";
import TokenFactoryAbi from "config/abi/token/factory.json";

interface TokenDeployEVMProps {
  setIsDeploying: (args: boolean) => void;
  deploySteps: DeployStep[];
  setDeploySteps: Dispatch<SetStateAction<DeployStep[]>>;
}

const initialDeploySteps = [
  {
    name: "Waiting",
    status: "current",
    description: "Approve transaction to deploy token",
  },
  {
    name: "Deploying",
    status: "upcoming",
    description: "Deploying token contract",
  },
  {
    name: "Completed",
    status: "upcoming",
    description: "Token successfully deployed",
  },
] as DeployStep[];

const TokenDeployEVM = ({ setIsDeploying, deploySteps, setDeploySteps }: TokenDeployEVMProps) => {
  const { chainId } = useActiveChainId();
  const factory = useTokenFactory(chainId);

  const [{ tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply }] = useDeployerTokenState("tokenInfo");

  const { onCreate } = useFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");

  const handleTokenDeployEVM = async () => {
    // Restore initial deploy steps
    setDeploySteps(initialDeploySteps);
    // Shows initial the deployment progress
    setIsDeploying(true);

    try {
      // Deploy farm contract
      const tx = await onCreate(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply.toString());
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Waiting",
        updatedStatus: "complete",
        updatedDescription: "Transaction approved",
      });

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "current",
      });

      const iface = new ethers.utils.Interface(TokenFactoryAbi);

      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "StandardTokenCreated") {
            const token = log.args.token;
            setDeployedAddress(token);

            updateDeployStatus({
              setStepsFn: setDeploySteps,
              targetStep: "Deploying",
              updatedStatus: "complete",
            });

            updateDeployStatus({
              setStepsFn: setDeploySteps,
              targetStep: "Completed",
              updatedStatus: "current",
            });

            updateDeployStatus({
              setStepsFn: setDeploySteps,
              targetStep: "Completed",
              updatedStatus: "complete",
            });
            break;
          }
        } catch (e) { }
      }
    } catch (e) {
      // Error deploying farm contract
      const currentStep = deploySteps.find((step) => step.status === "current");
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: currentStep.name,
        updatedStatus: "failed",
        updatedDescription: "Deployment failed",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="font-bold text-gray-200">Total fee</div>
        <div className="font-bold text-brand">
          {formatEther(BigInt(factory.serviceFee))} {getNativeSymbol(chainId)}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex w-full items-center gap-2"
          onClick={() => setDeployerTokenStep("details")}
        >
          Edit
        </Button>

        <Button type="button" onClick={() => handleTokenDeployEVM()} variant="brand" className="w-full">
          Deploy
        </Button>
      </div>
    </>
  );
};

export default TokenDeployEVM;

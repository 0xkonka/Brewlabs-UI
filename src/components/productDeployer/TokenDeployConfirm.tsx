import { useState } from "react";
import { formatEther } from "viem";
import { Pen } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";

import { getNativeSymbol } from "lib/bridge/helpers";
import { useTokenFactory } from "state/deploy/hooks";
import { useFactory } from "hooks/useFactory";
import { useActiveChainId } from "hooks/useActiveChainId";
import TokenFactoryAbi from "config/abi/token/factory.json";
import { NETWORKS } from "config/constants/networks";
import { useDeployerTokenState, setDeployedAddress, setDeployerTokenStep } from "state/deploy/deployerToken.store";
import TokenSummary from "components/productDeployer/TokenSummary";

import type { DeployStep } from "@components/DeployProgress";
import DeployProgress, { updateDeployStatus } from "@components/DeployProgress";

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

const TokenDeployConfirm = () => {
  const { chainId } = useActiveChainId();
  const factory = useTokenFactory(chainId);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState(initialDeploySteps);

  const [{ tokenName, tokenImage, tokenDescription, tokenSymbol, tokenDecimals, tokenTotalSupply }] =
    useDeployerTokenState("tokenInfo");

  const { onCreate } = useFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");

  const handleDeploy = async () => {
    // Restore initial deploy steps
    setDeploySteps(initialDeploySteps);
    // Shows initial the deployment progress
    setIsDeploying(true);

    try {
      // Deploy farm contract
      const tx = await onCreate(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply.toString());

      const iface = new ethers.utils.Interface(TokenFactoryAbi);

      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "StandardTokenCreated") {
            const token = log.args.token;
            setDeployedAddress(token);
            updateDeployStatus({
              setStepsFn: setDeploySteps,
              targetStep: "Waiting",
              updatedStatus: "complete",
              updatedDescription: "Transaction approved",
            });
            break;
          }
        } catch (e) {}
      }
    } catch (e) {
      toast.error("Error deploying token contract");
    }
    setIsDeploying(false);
  };

  return (
    <div className={`mx-auto my-8 max-w-xl ${isDeploying && "animate-pulse"}`}>
      {isDeploying && (
        <DeployProgress
          deploySteps={deploySteps}
          onError={() => setIsDeploying(false)}
          onSuccess={() => setDeployerTokenStep("success")}
        />
      )}

      {!isDeploying && (
        <>
          <h4 className="mb-6 text-xl">Summary</h4>
          <p className="my-2">You are about to deploy a new token on the {NETWORKS[chainId].chainName} network.</p>
          <p className="my-2">Please confirm the details.</p>

          <TokenSummary />

          <div className="flex items-center justify-between p-4">
            <div className="font-bold text-gray-200">Total fee</div>
            <div className="font-bold text-brand">
              {formatEther(BigInt(factory.serviceFee))} {getNativeSymbol(chainId)}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              onClick={() => setDeployerTokenStep("details")}
              className="flex w-full items-center gap-2"
            >
              Edit <Pen className="h-4 w-4" />
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

export default TokenDeployConfirm;

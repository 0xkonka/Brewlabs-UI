import { useState } from "react";
import { useSearchParams } from "next/navigation";

import TokenSummary from "components/productDeployer/TokenSummary";
import TokenDeployEVM from "./components/TokenDeployEVM";
import TokenDeploySolana from "./components/TokenDeploySolana";
import DeployProgress from "@components/DeployProgress";
import type { DeployStep } from "@components/DeployProgress";

import { useTokenFactory } from "state/deploy/hooks";
import { setDeployerTokenStep } from "state/deploy/deployerToken.store";
import { useActiveChainId } from "hooks/useActiveChainId";
import { ExtendedChainId, NETWORKS } from "config/constants/networks";

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

  // Get URL chainId
  const searchParams = useSearchParams();
  const chainIdFromUrl = Number(searchParams.get("chainId"));


  return (
    <div className="mx-auto my-8 max-w-2xl animate-in fade-in slide-in-from-right">
      {isDeploying && (
        <DeployProgress
          deploySteps={deploySteps}
          onError={() => setIsDeploying(false)}
          onSuccess={() => {
            setIsDeploying(false);
            setDeployerTokenStep("success");
          }}
        />
      )}

      {!isDeploying && (
        <>
          <h4 className="mb-6 text-xl">Summary</h4>
          <p className="my-2">You are about to deploy a new token on the {NETWORKS[chainId].chainName} network.</p>
          <p className="my-2">Please confirm the details.</p>

          <TokenSummary />

          {chainIdFromUrl === undefined ? (
            <div />
          ) : chainIdFromUrl === ExtendedChainId.SOLANA ? (
            <TokenDeploySolana setIsDeploying={setIsDeploying} />
          ) : (
            <TokenDeployEVM setIsDeploying={setIsDeploying} deploySteps={deploySteps} setDeploySteps={setDeploySteps} />
          )}
        </>
      )}
    </div>
  );
};

export default TokenDeployConfirm;

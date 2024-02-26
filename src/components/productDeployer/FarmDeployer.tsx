import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";

import { useDeployerState } from "state/deploy/deployer.store";

import DeployConfirmation from "@components/productDeployer/DeployConfirmation";
import SuccessfulDeploy from "@components/productDeployer/SuccessfulDeploy";

import FarmDetails from "@components/productDeployer/FarmDetails";

import { useActiveChainId } from "@hooks/useActiveChainId";
import useLPTokenInfo from "@hooks/useLPTokenInfo";

const FarmDeployer = () => {
  const [deployerStep] = useDeployerState("deployerStep");

  const { chainId } = useActiveChainId();

  const [router, setRouter] = useState<any>({ name: "" });
  const [lpAddress, setLpAddress] = useState("");

  const lpInfo = useLPTokenInfo(lpAddress, chainId);

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerStep === "details" && (
          <FarmDetails
            router={router}
            setRouter={setRouter}
            lpAddress={lpAddress}
            setLpAddress={setLpAddress}
            lpInfo={lpInfo}
          />
        )}
        {deployerStep === "confirm" && <DeployConfirmation />}
        {deployerStep === "success" && <SuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default FarmDeployer;

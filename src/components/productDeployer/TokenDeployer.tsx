import { Card, CardContent } from "@components/ui/card";

import { useDeployerState } from "state/deploy/deployer.store";

import TokenDetails from "@components/productDeployer/TokenDetails";
import TokenDeployConfirm from "@components/productDeployer/TokenDeployConfirm";
import TokenSuccessfulDeploy from "@components/productDeployer/TokenSuccessfulDeploy";

const TokenDeployer = () => {
  const [deployerStep] = useDeployerState("deployerStep");

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerStep === "details" && <TokenDetails />}
        {deployerStep === "confirm" && <TokenDeployConfirm />}
        {deployerStep === "success" && <TokenSuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default TokenDeployer;

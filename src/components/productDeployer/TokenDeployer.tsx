import { Card, CardContent } from "@components/ui/card";

import { useDeployerTokenState } from "state/deploy/deployerToken.store";

import TokenDetails from "@components/productDeployer/TokenDetails";
import TokenDeployConfirm from "@components/productDeployer/TokenDeployConfirm";
import TokenSuccessfulDeploy from "@components/productDeployer/TokenSuccessfulDeploy";

const TokenDeployer = () => {
  const [deployerStep] = useDeployerTokenState("deployerStep");

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

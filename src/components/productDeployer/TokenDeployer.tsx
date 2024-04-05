import { Card, CardContent } from "@components/ui/card";

import { useDeployerTokenState } from "state/deploy/deployerToken.store";

import TokenDetails from "@components/productDeployer/TokenDetails";
import TokenDeployConfirm from "@components/productDeployer/TokenDeployConfirm";
import TokenSuccessfulDeploy from "@components/productDeployer/TokenSuccessfulDeploy";

const TokenDeployer = () => {
  const [deployerTokenStep] = useDeployerTokenState("deployerTokenStep");

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerTokenStep === "details" && <TokenDetails />}
        {deployerTokenStep === "confirm" && <TokenDeployConfirm />}
        {deployerTokenStep === "success" && <TokenSuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default TokenDeployer;

import { Card, CardContent } from "@components/ui/card";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useDeployerTokenState } from "state/deploy/deployerToken.store";

import AlertConnection from "@components/AlertConnection";
import TokenDetails from "@components/productDeployer/TokenDetails";
import TokenDeployConfirm from "@components/productDeployer/TokenDeployConfirm";
import TokenSuccessfulDeploy from "@components/productDeployer/TokenSuccessfulDeploy";

const TokenDeployer = () => {
  const { chainId } = useActiveChainId();
  const [deployerTokenStep] = useDeployerTokenState("deployerTokenStep");

  if (chainId === undefined) {
    return <AlertConnection />;
  }

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

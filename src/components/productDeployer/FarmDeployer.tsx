import { Card, CardContent } from "@components/ui/card";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useDeployerFarmState } from "state/deploy/deployerFarm.store";

import AlertConnection from "@components/AlertConnection";
import FarmDetails from "@components/productDeployer/FarmDetails";
import FarmDeployConfirm from "@components/productDeployer/FarmDeployConfirm";
import FarmSuccessfulDeploy from "@components/productDeployer/FarmSuccessfulDeploy";

const FarmDeployer = () => {
  const { chainId } = useActiveChainId();
  const [deployerFarmStep] = useDeployerFarmState("deployerFarmStep");

  if (chainId === undefined) {
    return <AlertConnection />;
  }

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerFarmStep === "details" && <FarmDetails />}
        {deployerFarmStep === "confirm" && <FarmDeployConfirm />}
        {deployerFarmStep === "success" && <FarmSuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default FarmDeployer;

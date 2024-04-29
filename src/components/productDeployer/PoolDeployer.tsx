import { Card, CardContent } from "@components/ui/card";

import { useDeployerPoolState } from "state/deploy/deployerPool.store";

import PoolDetails from "@components/productDeployer/PoolDetails";
import PoolDeployConfirm from "@components/productDeployer/PoolDeployConfirm";
import PoolSuccessfulDeploy from "@components/productDeployer/PoolSuccessfulDeploy";

const PoolDeployer = () => {
  const [deployerPoolStep] = useDeployerPoolState("deployerPoolStep");

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerPoolStep === "details" && <PoolDetails />}
        {deployerPoolStep === "confirm" && <PoolDeployConfirm />}
        {deployerPoolStep === "success" && <PoolSuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default PoolDeployer;

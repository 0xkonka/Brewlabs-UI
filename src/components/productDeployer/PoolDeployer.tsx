import { Card, CardContent } from "@components/ui/card";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useDeployerPoolState } from "state/deploy/deployerPool.store";

import AlertConnection from "@components/AlertConnection";
import PoolDetails from "@components/productDeployer/PoolDetails";
import PoolDeployConfirm from "@components/productDeployer/PoolDeployConfirm";
import PoolSuccessfulDeploy from "@components/productDeployer/PoolSuccessfulDeploy";

const PoolDeployer = () => {
  const { chainId } = useActiveChainId();
  const [deployerPoolStep] = useDeployerPoolState("deployerPoolStep");

  if (chainId === undefined) {
    return <AlertConnection />;
  }

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

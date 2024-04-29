import { Card, CardContent } from "@components/ui/card";

import { useDeployerIndexState } from "state/deploy/deployerIndex.store";

import IndexDetails from "@components/productDeployer/IndexDetails";
import IndexDeployConfirm from "@components/productDeployer/IndexDeployConfirm";
import IndexSuccessfulDeploy from "@components/productDeployer/IndexSuccessfulDeploy";

const IndexDeployer = () => {
  const [deployerIndexStep] = useDeployerIndexState("deployerIndexStep");

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerIndexStep === "details" && <IndexDetails />}
        {deployerIndexStep === "confirm" && <IndexDeployConfirm />}
        {deployerIndexStep === "success" && <IndexSuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default IndexDeployer;

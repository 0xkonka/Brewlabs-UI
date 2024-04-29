import { Card, CardContent } from "@components/ui/card";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useDeployerFarmState } from "state/deploy/deployerFarm.store";

import FarmDetails from "@components/productDeployer/FarmDetails";
import FarmDeployConfirm from "@components/productDeployer/FarmDeployConfirm";
import FarmSuccessfulDeploy from "@components/productDeployer/FarmSuccessfulDeploy";

const FarmDeployer = () => {
  const { chainId } = useActiveChainId();
  const [deployerFarmStep] = useDeployerFarmState("deployerFarmStep");

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerFarmStep === "details" && (
          <>
            {chainId === undefined ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading...</p>
              </div>
            ) : (
              <FarmDetails />
            )}
          </>
        )}

        {deployerFarmStep === "confirm" && <FarmDeployConfirm />}
        {deployerFarmStep === "success" && <FarmSuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default FarmDeployer;

import { useState } from "react";
import { Card, CardContent } from "@components/ui/card";

import FarmDetails from "@components/productDeployer/FarmDetails";
import FarmDeployConfirm from "@components/productDeployer/FarmDeployConfirm";
import SuccessfulDeploy from "@components/productDeployer/SuccessfulDeploy";

import useLPTokenInfo from "@hooks/useLPTokenInfo";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useDeployerFarmState } from "state/deploy/deployerFarm.store";

const FarmDeployer = () => {
  const { chainId } = useActiveChainId();
  const [deployerFarmStep] = useDeployerFarmState("deployerFarmStep");

  const [lpAddress, setLpAddress] = useState("");
  const [router, setRouter] = useState({ name: "" });
  const lpInfo = useLPTokenInfo(lpAddress, chainId);

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        {deployerFarmStep === "details" && (
          <>
            {chainId === -1 || chainId === undefined ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
                <span className="loading loading-spinner loading-md"></span>
                <p>Loading...</p>
              </div>
            ) : (
              <FarmDetails
                router={router}
                lpInfo={lpInfo}
                lpAddress={lpAddress}
                setRouter={setRouter}
                setLpAddress={setLpAddress}
              />
            )}
          </>
        )}

        {deployerFarmStep === "confirm" && <FarmDeployConfirm router={router} lpInfo={lpInfo} />}
        {deployerFarmStep === "success" && <SuccessfulDeploy />}
      </CardContent>
    </Card>
  );
};

export default FarmDeployer;

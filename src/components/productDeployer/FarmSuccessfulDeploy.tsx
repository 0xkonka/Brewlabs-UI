import { Check } from "lucide-react";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { getExplorerLogo, getBlockExplorerLink } from "utils/functions";
import { useDeployerFarmState } from "state/deploy/deployerFarm.store";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

const FarmSuccessfulDeploy = () => {
  const { chainId } = useActiveChainId();
  const [{ farmLpAddress }] = useDeployerFarmState("farmInfo");
  const [deployedFarmAddress] = useDeployerFarmState("deployedFarmAddress");

  return (
    <div className="mx-auto my-8 max-w-2xl animate-in fade-in slide-in-from-right">
      <h4 className="mb-6 flex items-center gap-2 text-xl">
        Deployed successfully <Check className="h-6 w-6 text-green-500" />
      </h4>
      <Alert>
        <AlertTitle className="mt-3">Summary</AlertTitle>
        <AlertDescription>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Yield farm contract address</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
                  <a
                    href={getBlockExplorerLink(deployedFarmAddress, "address", chainId)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {deployedFarmAddress.slice(0, 12)}....
                  </a>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Liquidity token address</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
                  <a href={getBlockExplorerLink(farmLpAddress, "address", chainId)} target="_blank" rel="noreferrer">
                    {farmLpAddress.slice(0, 12)}....
                  </a>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white">Yield farm reward start</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">After 100 blocks</dd>
              </div>
            </dl>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FarmSuccessfulDeploy;

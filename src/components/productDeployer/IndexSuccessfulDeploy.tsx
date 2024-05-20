import { Check } from "lucide-react";
import { getExplorerLogo, getBlockExplorerLink } from "utils/functions";
import { useDeployerIndexState } from "state/deploy/deployerIndex.store";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

const IndexSuccessfulDeploy = () => {
  const [{ indexDeployChainId }] = useDeployerIndexState("indexInfo");
  const [deployedIndexAddress] = useDeployerIndexState("deployedIndexAddress");

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
                <dt className="text-sm font-medium leading-6 text-white">Index contract address</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <img src={getExplorerLogo(indexDeployChainId)} className="mr-1 h-4 w-4" alt="explorer" />
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={getBlockExplorerLink(deployedIndexAddress, "address", indexDeployChainId)}
                  >
                    {deployedIndexAddress.slice(0, 12)}....
                  </a>
                </dd>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-white">View indexes</dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                    <a target="_blank" rel="noreferrer" href=" https://earn.brewlabs.info/indexes">
                      Visit indexes page
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default IndexSuccessfulDeploy;

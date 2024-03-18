import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useActiveChainId } from "hooks/useActiveChainId";
import { ChainId } from "@brewlabs/sdk";
import TokenSummary from "components/productDeployer/TokenSummary";
import TokenDeployEVM from "./components/TokenDeployEVM";
import TokenDeploySolana from "./components/TokenDeploySolana";
import { useSolanaNetwork } from "contexts/SolanaNetworkContext";

const DeployConfirmation = () => {
  const { chainId, isLoading } = useActiveChainId();

  const [isDeploying, setIsDeploying] = useState(false);

  const { isSolanaNetwork, setIsSolanaNetwork } = useSolanaNetwork();

  if (chainId === (900 as ChainId)) {
    setIsSolanaNetwork(true);
  } else setIsSolanaNetwork(false);

  console.log('chainId', chainId)
  console.log('isSolanaNetwork', isSolanaNetwork)

  return (
    <div className={`mx-auto my-8 max-w-xl ${isDeploying && "animate-pulse"}`}>
      {isDeploying && isSolanaNetwork ? (
        <div className="absolute inset-0 flex h-full w-full items-center justify-between rounded-3xl bg-zinc-900/40">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
        </div>
      ) : <>

        <h4 className="mb-6 text-xl">Summary</h4>

        <p className="my-2">You are about to deploy a new token contract on the __insert name__ network.</p>
        <p className="my-2">Please confirm the details.</p>

        <TokenSummary />

        {
          isSolanaNetwork === true ?
            <TokenDeploySolana setIsDeploying={setIsDeploying} /> :
            <TokenDeployEVM setIsDeploying={setIsDeploying}/>
        }
      </>
      }
    </div>
  );
};

export default DeployConfirmation;

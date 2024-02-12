import { useState } from "react";
import { formatEther } from "viem";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import { Button } from "components/ui/button";

import { getNativeSymbol } from "lib/bridge/helpers";
import { useTokenFactory } from "state/deploy/hooks";
import { useFactory } from "hooks/useFactory";
import { useActiveChainId } from "hooks/useActiveChainId";
import TokenFactoryAbi from "config/abi/token/factory.json";
import { useDeployerState, setDeployedAddress, setDeployerStep } from "state/deploy/deployer.store";
import TokenSummary from "./TokenSummary";

const DeployConfirmation = () => {
  const { chainId } = useActiveChainId();
  const factory = useTokenFactory(chainId);
  const [isDeploying, setIsDeploying] = useState(false);
  const [{ tokenName, tokenImage, tokenDescription, tokenSymbol, tokenDecimals, tokenTotalSupply }] =
    useDeployerState("tokenInfo");

  const { onCreate } = useFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");

  const handleDeploy = async () => {
    setIsDeploying(true);

    // Toggle for testing
    // setTimeout(() => {
    //   setDeployedAddress("0x");
    //   setDeployerStep("success");
    // }, 3000);

    try {
      // Deploy farm contract
      const tx = await onCreate(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply.toString());

      const iface = new ethers.utils.Interface(TokenFactoryAbi);

      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "StandardTokenCreated") {
            const token = log.args.token;
            setDeployedAddress(token);
            setDeployerStep("success");
            break;
          }
        } catch (e) {}
      }
    } catch (e) {
      toast.error("Error deploying token contract");
    }
    setIsDeploying(false);
  };

  return (
    <div className={`mx-auto my-8 max-w-xl ${isDeploying && "animate-pulse"}`}>
      {isDeploying && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-between rounded-3xl bg-zinc-900/40">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
        </div>
      )}

      <h4 className="mb-6 text-xl">Summary</h4>

      <p className="my-8">
        You are about to deploy a new token contract on the {chainId} network. Please confirm the details.
      </p>

      <TokenSummary />

      <div className="flex items-center justify-between p-4">
        <div className="font-bold text-gray-200">Total fee</div>
        <div className="font-bold text-brand">
          {formatEther(BigInt(factory.serviceFee))} {getNativeSymbol(chainId)}
        </div>
      </div>

      <Button onClick={() => handleDeploy()} variant="brand" className="w-full">
        Deploy
      </Button>
    </div>
  );
};

export default DeployConfirmation;

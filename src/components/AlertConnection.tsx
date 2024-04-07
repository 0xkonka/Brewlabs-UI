import { useAccount } from "wagmi";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";

const AlertConnection = ({ isSupportedNetwork }: { isSupportedNetwork: boolean }) => {
  const { address, status } = useAccount();

  if (status === "disconnected" && !address) {
    return (
      <Alert variant="destructive" className="my-4 bg-red-500/10 text-red-100 animate-in fade-in-30">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Not connected</AlertTitle>
        <AlertDescription className="text-balance">Please connect your wallet to continue.</AlertDescription>
      </Alert>
    );
  }

  if (isSupportedNetwork) return null;

  return (
    <Alert variant="destructive" className="my-4 bg-red-500/10 text-red-100">
      <AlertTriangle className="h-4 w-4 animate-pulse" />
      <AlertTitle>Unsupported network</AlertTitle>
      <AlertDescription className="text-balance">
        The current network is not supported for this product. Please switch to a supported network to continue.
      </AlertDescription>
    </Alert>
  );
};

export default AlertConnection;

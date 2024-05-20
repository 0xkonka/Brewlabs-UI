import { useAccount } from "wagmi";
import { WalletIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";

const AlertConnection = () => {
  const { address, status } = useAccount();

  if (status === "disconnected" && !address) {
    return (
      <Alert className="my-4 max-w-lg border-yellow-400 bg-yellow-200/10 text-yellow-100 animate-in slide-in-from-bottom">
        <WalletIcon className="mx-auto !text-yellow-500" />

        <div className="ml-4 py-1">
          <AlertTitle>Not connected</AlertTitle>
          <AlertDescription className="text-balance">Please connect your wallet to continue.</AlertDescription>
        </div>
      </Alert>
    );
  }
};

export default AlertConnection;

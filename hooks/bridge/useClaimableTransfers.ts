import { useEffect, useState } from "react";
import { useBridgeContext } from "contexts/BridgeContext";
import { useBridgeDirection } from "./useBridgeDirection";
import { combineRequestsWithExecutions, getExecutions, getRequests } from "lib/bridge/history";
import { useAccount } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";

export const useClaimableTransfers = () => {
  const { address: account } = useAccount();
  const { chainId: providerChainId } = useActiveChainId();
  const { homeChainId, foreignChainId, getGraphEndpoint } = useBridgeDirection(providerChainId);
  const { txHash }: any = useBridgeContext();
  const [transfers, setTransfers] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return () => undefined;

    let isSubscribed = true;
    async function update() {
      setLoading(true);
      setTransfers([]);
      if (!account) return;

      const { requests } = await getRequests(account, getGraphEndpoint(homeChainId));
      const { executions } = await getExecutions(getGraphEndpoint(foreignChainId), requests);
      const homeTransfers = combineRequestsWithExecutions(requests, executions, homeChainId, foreignChainId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter((t) => !t.receivingTx);
      if (isSubscribed) {
        setTransfers(homeTransfers);
        setLoading(false);
      }
    }
    update();
    return () => {
      isSubscribed = false;
    };
  }, [account, txHash, homeChainId, foreignChainId, getGraphEndpoint]);

  return { transfers: transfers, loading };
};

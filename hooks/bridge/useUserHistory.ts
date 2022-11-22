import { useState } from "react";
import { useAccount } from "wagmi";
import { useFastRefreshEffect } from "hooks/useRefreshEffect";
import { combineRequestsWithExecutions, getExecutions, getRequests } from "lib/bridge/history";
import { useBridgeDirection } from "./useBridgeDirection";

export const useUserHistory = () => {
  const { homeChainId, foreignChainId, getGraphEndpoint } = useBridgeDirection();
  const { address: account } = useAccount();

  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFastRefreshEffect(() => {
    if (!account) {
      setLoading(false);
      return () => undefined;
    }
    let isSubscribed = true;
    async function update() {
      if (!account) {
        setTransfers([]);
        return;
      }

      setLoading(true);
      const [{ requests: homeRequests }, { requests: foreignRequests }] = await Promise.all([
        getRequests(account, getGraphEndpoint(homeChainId)),
        getRequests(account, getGraphEndpoint(foreignChainId)),
      ]);
      const [{ executions: homeExecutions }, { executions: foreignExecutions }] = await Promise.all([
        getExecutions(getGraphEndpoint(homeChainId), foreignRequests),
        getExecutions(getGraphEndpoint(foreignChainId), homeRequests),
      ]);
      const homeTransfers = combineRequestsWithExecutions(homeRequests, foreignExecutions, homeChainId, foreignChainId);
      const foreignTransfers = combineRequestsWithExecutions(
        foreignRequests,
        homeExecutions,
        foreignChainId,
        homeChainId
      );
      const allTransfers = [...homeTransfers, ...foreignTransfers].sort((a, b) => b.timestamp - a.timestamp);
      if (isSubscribed) {
        setTransfers(allTransfers);
        setLoading(false);
      }
    }

    update();

    return () => {
      isSubscribed = false;
    };
  }, [homeChainId, foreignChainId, account, getGraphEndpoint]);

  return { transfers, loading };
};

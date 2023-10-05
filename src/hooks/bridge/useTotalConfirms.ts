import { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";

import { fetchConfirmations } from "lib/bridge/amb";
import { getNetworkLabel } from "lib/bridge/helpers";
import { useEthersProvider } from "utils/ethersAdapter";

export const useTotalConfirms = (
  homeChainId: ChainId,
  foreignChainId: ChainId,
  homeAmbAddress: string,
  foreignAmbAddress: string
) => {
  const homeProvider = useEthersProvider({ chainId: homeChainId })
  const foreignProvider = useEthersProvider({ chainId: foreignChainId })

  const [homeTotalConfirms, setHomeTotalConfirms] = useState(8);
  const [foreignTotalConfirms, setForeignTotalConfirms] = useState(8);

  useEffect(() => {
    const homeLabel = getNetworkLabel(homeChainId).toUpperCase();
    const homeKey = `${homeLabel}-${homeAmbAddress.toUpperCase()}-TOTAL-CONFIRMATIONS`;

    const foreignLabel = getNetworkLabel(foreignChainId).toUpperCase();
    const foreignKey = `${foreignLabel}-${foreignAmbAddress.toUpperCase()}-TOTAL-CONFIRMATIONS`;

    const fetchConfirms = async () => {
      try {
        const [home, foreign] = await Promise.all([
          fetchConfirmations(homeAmbAddress, homeProvider),
          fetchConfirmations(foreignAmbAddress, foreignProvider),
        ]);
        setHomeTotalConfirms(home);
        setForeignTotalConfirms(foreign);
        sessionStorage.setItem(homeKey, home.toString());
        sessionStorage.setItem(foreignKey, foreign.toString());
      } catch (confirmsError) {
        console.error({ confirmsError });
      }
    };

    const homeConfirms = sessionStorage.getItem(homeKey);
    const foreignConfirms = sessionStorage.getItem(foreignKey);
    if (homeConfirms && foreignConfirms) {
      setHomeTotalConfirms(Number.parseInt(homeConfirms, 10));
      setForeignTotalConfirms(Number.parseInt(foreignConfirms, 10));
    } else {
      fetchConfirms();
    }
  }, [homeChainId, foreignChainId, homeAmbAddress, foreignAmbAddress]);

  return { homeTotalConfirms, foreignTotalConfirms };
};

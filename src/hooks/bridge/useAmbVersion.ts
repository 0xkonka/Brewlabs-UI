import { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";

import { fetchAmbVersion } from "lib/bridge/amb";
import { getNetworkLabel } from "lib/bridge/helpers";
import { getViemClients } from "utils/viem";

export const useAmbVersion = (foreignChainId: ChainId, foreignAmbAddress: string) => {
  const [foreignAmbVersion, setForeignAmbVersion] = useState<string | null>("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const label = getNetworkLabel(foreignChainId).toUpperCase();
    const key = `${label}-AMB-VERSION`;
    const fetchVersion = async () => {
      const client = getViemClients({ chainId: foreignChainId });
      await fetchAmbVersion(foreignAmbAddress, client)
        .then((versionString) => {
          setForeignAmbVersion(versionString);
          sessionStorage.setItem(key, versionString);
        })
        .catch((versionError) => console.error({ versionError }));
      setFetching(false);
    };
    const version = sessionStorage.getItem(key);
    if (!version && !fetching) {
      setFetching(true);
      fetchVersion();
    } else {
      setForeignAmbVersion(version);
    }
  }, [foreignAmbAddress, foreignChainId, fetching]);

  return foreignAmbVersion;
};

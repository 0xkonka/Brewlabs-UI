import { useEffect, useState } from "react";
import { ChainId } from "@brewlabs/sdk";

import { getNetworkLabel } from "lib/bridge/helpers";
import { fetchRequiredSignatures, fetchValidatorList } from "lib/bridge/message";
import { getViemClients } from "utils/viem";

export const useValidatorsContract = (foreignChainId: ChainId, foreignAmbAddress: string) => {
  const [requiredSignatures, setRequiredSignatures] = useState(0);
  const [validatorList, setValidatorList] = useState<string[]>([]);

  useEffect(() => {
    const label = getNetworkLabel(foreignChainId).toUpperCase();
    const key = `${label}-${foreignAmbAddress.toUpperCase()}-REQUIRED-SIGNATURES`;
    const fetchValue = async () => {
      try {
        const publicClient = getViemClients({ chainId: foreignChainId });
        const res = await fetchRequiredSignatures(foreignAmbAddress, publicClient);
        const signatures = Number.parseInt(res.toString(), 10);
        setRequiredSignatures(signatures);
        sessionStorage.setItem(key, signatures.toString());
      } catch (versionError) {
        console.error({ versionError });
      }
    };
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      setRequiredSignatures(Number.parseInt(storedValue, 10));
    } else {
      fetchValue();
    }
  }, [foreignAmbAddress, foreignChainId]);

  useEffect(() => {
    const label = getNetworkLabel(foreignChainId).toUpperCase();
    const key = `${label}-${foreignAmbAddress.toUpperCase()}-VALIDATOR-LIST`;
    const fetchValue = async () => {
      try {
        const publicClient = getViemClients({ chainId: foreignChainId });
        const res = await fetchValidatorList(foreignAmbAddress, publicClient);
        setValidatorList(res as string[]);
        sessionStorage.setItem(key, JSON.stringify(res));
      } catch (versionError) {
        console.error({ versionError });
      }
    };
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      setValidatorList(JSON.parse(storedValue));
    } else {
      fetchValue();
    }
  }, [foreignAmbAddress, foreignChainId]);

  return { requiredSignatures, validatorList };
};

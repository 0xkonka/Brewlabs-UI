import { useMemo } from "react";
import { ChainId } from "@brewlabs/sdk";
import useSWRImmutable from "swr/immutable";
import { Address } from "wagmi";

import { useUNSContract } from "hooks/useContract";

function getUnsAddress(networkId) {
  if ([1].includes(networkId)) {
    return "0x049aba7510f45BA5b64ea9E658E342F904DB358D";
  }
  if ([137].includes(networkId)) {
    return "0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f";
  }
  return "";
}

export const useUnsNameForAddress = (address: Address, fetchData = true) => {
  const unsEtherContract = useUNSContract(ChainId.ETHEREUM, getUnsAddress(1));
  const unsPolygonContract = useUNSContract(ChainId.POLYGON, getUnsAddress(137));

  const { data: unsName, isLoading } = useSWRImmutable(
    fetchData && address ? ["unsName", address.toLowerCase()] : null,
    async () => {
      const etherDomainName = await unsEtherContract.read.reverseNameOf([address]);
      if (!etherDomainName) {
        const polyDomainName = await unsPolygonContract.read.reverseNameOf([address]);
        if (!polyDomainName) {
          return {
            name: null,
          };
        }
        return {
          name: polyDomainName,
        };
      }
      return {
        name: etherDomainName,
      };
    }
  );

  return useMemo(() => {
    return { unsName: unsName?.name, isLoading };
  }, [unsName, isLoading]);
};

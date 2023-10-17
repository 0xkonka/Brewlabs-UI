import { useMemo } from "react";
import { namehash, normalize } from "viem/ens";
import contenthashToUri from "utils/contenthashToUri";
import { parseENSAddress } from "utils/ENS/parseENSAddress";
import uriToHttp from "utils/uriToHttp";

export default function useHttpLocations(uri: string | undefined): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri]);
  const resolvedContentHash = namehash(normalize(ens?.ensName));
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash ? uriToHttp(contenthashToUri(resolvedContentHash)) : [];
    }
    return uri ? uriToHttp(uri) : [];
  }, [ens, resolvedContentHash, uri]);
}

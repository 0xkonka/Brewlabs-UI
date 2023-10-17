import { Address } from "viem";

import MulticallAbi from "config/abi/Multicall";
import { getMulticallAddress } from "utils/addressHelpers";
import { useSingleCallResult } from "../state/multicall/hooks";
import { useActiveChainId } from "./useActiveChainId";

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): bigint | undefined {
  const { chainId } = useActiveChainId();
  return useSingleCallResult({
    contract: {
      address: getMulticallAddress(chainId) as Address,
      abi: MulticallAbi,
    },
    functionName: "getCurrentBlockTimestamp",
  })?.result;
}

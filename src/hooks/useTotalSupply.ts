import { Token, TokenAmount } from "@brewlabs/sdk";
import { useTokenContract } from "./useContract";
import { useSingleCallResult } from "../state/multicall/hooks";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address);

  const totalSupply: string | undefined = useSingleCallResult({
    contract,
    functionName: "totalSupply",
    args: [],
  })?.result.toString();

  return token && totalSupply ? new TokenAmount(token, totalSupply) : undefined;
}

export default useTotalSupply;

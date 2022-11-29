import { useAccount, useProvider } from "wagmi";
import { useActiveChainId } from "./useActiveChainId";

export default function useActiveWeb3React() {
  const { chainId } = useActiveChainId();
  const provider = useProvider({ chainId });
  const { address: account } = useAccount();

  return {
    chainId,
    library: provider,
    account: account,
  };
}

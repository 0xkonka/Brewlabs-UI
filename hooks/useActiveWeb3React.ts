import { useAccount, useNetwork, useProvider } from "wagmi";
import { useActiveChainId } from "./useActiveChainId";

export default function useActiveWeb3React() {
  const { chain } = useNetwork()
  const { chainId } = useActiveChainId();
  const provider = useProvider({ chainId });
  const { address: account, connector, isConnected, isConnecting } = useAccount();

  return {
    account,
    chainId,
    chain,
    connector,
    isConnected,
    isConnecting,
    library: provider,
  };
}
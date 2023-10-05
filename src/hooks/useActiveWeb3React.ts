import { useAccount, useNetwork } from "wagmi";
import { useEthersProvider } from "utils/ethersAdapter";

import { useActiveChainId } from "./useActiveChainId";

export default function useActiveWeb3React() {
  const { chain } = useNetwork();
  const { chainId, isWrongNetwork } = useActiveChainId();
  const provider = useEthersProvider({ chainId });
  const { address: account, connector, isConnected, isConnecting } = useAccount();

  return {
    account: connector && isConnected ? account : undefined,
    chainId,
    chain,
    connector,
    isConnected,
    isConnecting,
    isWrongNetwork,
    library: provider,
  };
}

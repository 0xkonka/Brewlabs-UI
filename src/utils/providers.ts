import { SupportedChains } from "config/constants/networks";
import { ethers } from "ethers";
// import/no-anonymous-default-export
export const simpleRpcProvider = (chainId: number) =>
  new ethers.providers.JsonRpcProvider(
    chainId === 1
      ? "https://cloudflare-eth.com"
      : SupportedChains.find((chain) => chain.id === chainId)?.rpcUrls.default
  );

export default null;

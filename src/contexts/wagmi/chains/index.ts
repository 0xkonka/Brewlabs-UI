export * from "wagmi/chains";
import { Chain } from "wagmi";

export const brise: Chain = {
  id: 32520,
  name: "Brise Chain Mainnet",
  network: "cronos",
  nativeCurrency: { name: "Brise", symbol: "BRISE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet-rpc.brisescan.com/"] },
    public: { http: ["https://mainnet-rpc.brisescan.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Bitgert",
      url: "https://brisescan.com",
    },
  },
};

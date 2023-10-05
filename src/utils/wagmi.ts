import { configureChains, createConfig, createStorage } from "wagmi";
import memoize from "lodash/memoize";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { SafeConnector } from "wagmi/connectors/safe";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { BASE_URL } from "config";
import { SupportedChains } from "config/constants/networks";

import { mainnet, BinanceWalletConnector } from "../contexts/wagmi";

export const { publicClient, chains } = configureChains(SupportedChains, [
  jsonRpcProvider({
    rpc: (chain) => {
      switch (chain.id) {
        case mainnet.id:
          return { http: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" };
        default:
          return { http: chain.rpcUrls.default.http[0] };
      }
    },
  }),
]);

export const noopStorage = {
  getItem: (_key) => "",
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
};

export const wagmiConfig = createConfig({
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : noopStorage,
    key: "wagmi_v1.4",
  }),
  autoConnect: true,
  publicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Brewlabs Earn",
        appLogoUrl: `${BASE_URL}/logo.png`,
      },
    }),
    new BinanceWalletConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "3f9ccaf57c23a26a29b6ede970ea33c1",
      },
    }),
    new LedgerConnector({
      chains,
      options: {
        projectId: "e542ff314e26ff34de2d4fba98db70bb",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${typeof detectedName === "string" ? detectedName : detectedName.join(", ")})`,
        shimDisconnect: true,
      },
    }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/https:\/\/app.safe.global$/],
        debug: false,
      },
    }),
  ],
});

export const CHAIN_IDS = chains.map((c) => c.id);

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId));
export const isChainTestnet = memoize((chainId: number) => chains.find((c) => c.id === chainId)?.["testnet"]);

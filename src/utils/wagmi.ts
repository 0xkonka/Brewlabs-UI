import { configureChains, createConfig, createStorage } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
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

import { mainnet, BinanceWalletConnector, TrustWalletConnector } from "../contexts/wagmi";

export const { publicClient, chains } = configureChains(
  SupportedChains,
  [
    publicProvider(),
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
  ],
  {
    batch: {
      multicall: {
        batchSize: 1024 * 200,
        wait: 16,
      },
    },
    pollingInterval: 6_000,
  }
);

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    name: (detectedName) => `Injected (${typeof detectedName === "string" ? detectedName : detectedName.join(", ")})`,
    shimDisconnect: true,
  },
});

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    UNSTABLE_shimOnConnectSelectAccount: true,
  },
});

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: "Brewlabs Earn",
    appLogoUrl: `${BASE_URL}/logo.png`,
  },
});

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: "3f9ccaf57c23a26a29b6ede970ea33c1",
  },
});

const safeConnector = new SafeConnector({
  chains,
  options: {
    allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
    debug: false,
  },
});

const ledgerConnector = new LedgerConnector({
  chains,
  options: {
    projectId: "3f9ccaf57c23a26a29b6ede970ea33c1",
  },
});

export const bscConnector = new BinanceWalletConnector({ chains });

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

export const noopStorage = {
  getItem: (_key) => "",
  setItem: (_key, _value) => null,
  removeItem: (_key) => null,
};

export const wagmiConfig = createConfig({
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : noopStorage,
    key: "brewlabs_earn",
  }),
  autoConnect: true,
  publicClient,
  connectors: [
    injectedConnector,
    metaMaskConnector,
    bscConnector,
    coinbaseConnector,
    walletConnectConnector,
    // @ts-ignore FIXME: wagmi
    ledgerConnector,
    trustWalletConnector,
    safeConnector,
  ],
});

export const CHAIN_IDS = chains.map((c) => c.id);

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId));
export const isChainTestnet = memoize((chainId: number) => chains.find((c) => c.id === chainId)?.["testnet"]);

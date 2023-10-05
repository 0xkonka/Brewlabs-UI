import type { ExtendEthereum } from "global";
import { isFirefox } from "react-device-detect";

import { BASE_URL } from "config";
import { WalletConfig } from "./types";
import { getTrustWalletProvider } from "contexts/wagmi";

export class WalletConnectorNotFoundError extends Error {}
export class WalletSwitchChainError extends Error {}

export enum ConnectorNames {
  MetaMask = "metaMask",
  Injected = "injected",
  BSC = "bsc",
  WalletConnect = "walletConnect",
  WalletLink = "coinbaseWallet",
  Ledger = "ledger",
  GnosisSafe = "safe",
  TrustWallet = "trustWallet",
}

export const wallets: WalletConfig<ConnectorNames>[] = [
  {
    id: "metamask",
    title: "Metamask",
    description: "Connect to your MetaMask Wallet",
    icon: "/images/wallets/metamask.png",
    installed: typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask),
    connectorId: ConnectorNames.MetaMask,
    deepLink: "https://metamask.app.link/dapp/earn.brewlabs.info/",
    downloadLink: "https://metamask.app.link/dapp/earn.brewlabs.info/",
  },
  {
    id: "injected",
    title: "Injected",
    description: "Connect to your injected wallet",
    icon: "/images/wallets/injected.svg",
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== "undefined" && !!window.ethereum,
  },
  {
    id: "binance",
    title: "Binance Wallet",
    description: "Connect to your Binance Wallet",
    icon: "/images/wallets/binance.png",
    installed: typeof window !== "undefined" && Boolean(window.BinanceChain),
    connectorId: ConnectorNames.BSC,
    guide: {
      desktop: "https://www.bnbchain.org/en/binance-wallet",
    },
    downloadLink: {
      desktop: isFirefox
        ? "https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search"
        : "https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp",
    },
  },
  {
    id: "coinbase",
    title: "Coinbase Wallet",
    description: "Connect to your Coinbase Wallet",
    icon: "/images/wallets/coinbase.png",
    connectorId: ConnectorNames.WalletLink,
  },
  {
    id: "trust",
    title: "Trust Wallet",
    description: "Connect to your Trust Wallet",
    icon: "/images/wallets/trust.png",
    connectorId: ConnectorNames.Injected,
    installed: !!getTrustWalletProvider(),
    deepLink: `https://link.trustwallet.com/open_url?coin_id=20000714&url=${BASE_URL}`,
    downloadLink: {
      desktop: "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related",
    },
  },
  {
    id: "safepal",
    title: "SafePal",
    description: "Connect to your SafePal Wallet",
    icon: "/images/wallets/safepal.png",
    connectorId: ConnectorNames.Injected,
    installed: typeof window !== "undefined" && Boolean((window.ethereum as ExtendEthereum)?.isSafePal),
    downloadLink: "https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa",
  },
  {
    id: "walletconnect",
    title: "WalletConnect",
    description: "Scan with WalletConnect to connect",
    icon: "/images/wallets/walletconnect.png",
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    id: "safe",
    title: "Gnosis Safe",
    description: "Connect to safe apps",
    icon: `/images/wallets/safe.webp`,
    connectorId: ConnectorNames.GnosisSafe,
  },
  {
    id: "ledger",
    title: "Ledger",
    description: "Connect to your Ledger Wallet",
    icon: `/images/wallets/ledger.png`,
    connectorId: ConnectorNames.Ledger,
  },
];

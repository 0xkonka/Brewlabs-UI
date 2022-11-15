import { ChainId } from "@brewlabs/sdk";
import { bridgeConfigs } from "config/constants/bridge";
import { CHAIN_LABLES } from "config/constants/networks";
import { BridgeToken } from "config/constants/types";
import { Connector } from "wagmi";

const IMPOSSIBLE_ERROR = "Unable to perform the operation. Reload the application and try again.";

const TRANSACTION_REPLACED_ERROR =
  "Transaction was replaced by another. Reload the application and find the transaction in the history page.";

export const handleWalletError = (error: any, showError: (msg: string) => void) => {
  if (error?.message && error?.message.length <= 120) {
    showError(error.message);
  } else if (error?.message && error?.message.toLowerCase().includes("transaction was replaced")) {
    showError(TRANSACTION_REPLACED_ERROR);
  } else {
    showError(IMPOSSIBLE_ERROR);
  }
};

export const getNetworkLabel = (chainId: ChainId) => {
  return CHAIN_LABLES[chainId];
};

export const getMediatorAddress = (chainId: ChainId) => {
  const direction = bridgeConfigs.find((direction) => direction.homeChainId === chainId) ?? bridgeConfigs[0];
  return direction.homeMediatorAddress;
};

export const addTokenToMetamask = async (conector: Connector, { address, symbol, decimals }: BridgeToken) => {
  if (address && symbol && conector?.watchAsset) {
    await conector.watchAsset({ address, symbol, decimals });
  }
};

// eslint-disable-next-line no-promise-executor-return
export const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const withTimeout = (ms: number, promise: any) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('timed out'));
    }, ms);

    promise
      .then((value: any) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: any) => {
        clearTimeout(timer);
        reject(error);
      });
  });

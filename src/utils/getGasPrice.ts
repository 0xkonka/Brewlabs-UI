import { ChainId } from "@brewlabs/sdk";
import store from "state";
import { GAS_PRICE_GWEI } from "state/user/hooks/helpers";

/**
 * Function to return gasPrice outwith a react component
 */
export const getNetworkGasPrice = async (chainId, client) => {
  let gasPrice = await client.getGasPrice();
  if (!gasPrice) return undefined;

  switch (chainId) {
    case ChainId.ETHEREUM:
      gasPrice = gasPrice + BigInt(5 * 1e9); // + 5 Gwei
      break;
    case ChainId.FANTOM:
      gasPrice = gasPrice * BigInt(2);
      break;
    default:
  }
  return gasPrice.toString();
};

const getGasPrice = (): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const state = store.getState();
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI.default;
  return chainId === ChainId.BSC_MAINNET.toString() ? userGas : GAS_PRICE_GWEI.testnet;
};

export default getGasPrice;

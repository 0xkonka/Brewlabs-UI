import { getAccount } from "@wagmi/core";

/**
 * Wrap functions that require the user to be connected
 * @param fnsArray
 */
export const mustBeConnected = (fnsArray: Function[]) => {
  const { status } = getAccount();

  if (status !== "connected") {
    document.getElementById("wallet-connect-button")?.click();
    return;
  }

  fnsArray.forEach((fn) => fn());
};

import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { getLanguageCodeFromLS } from "contexts/localization/helpers";

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).times(new BigNumber(10).pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals));
};

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber();
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number) => {
  return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
};

export const formatNumber = (number: number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };
  return number.toLocaleString(undefined, options);
};

/**
 * Method to format the display of wei given an ethers.BigNumber object
 * Note: does NOT round
 */
export const formatBigNumber = (number: bigint, displayDecimals = 18, decimals = 18) => {
  const remainder = number % BigInt(10 ** (decimals - displayDecimals));
  return formatUnits(number - remainder, decimals);
};

/**
 * Method to format the display of wei given an ethers.BigNumber object with toFixed
 * Note: rounds
 */
export const formatBigNumberToFixed = (number: ethers.BigNumber, displayDecimals = 18, decimals = 18) => {
  const formattedString = formatUnits(number, decimals);
  return (+formattedString).toFixed(displayDecimals);
};

/**
 * Formats a FixedNumber like BigNumber
 * i.e. Formats 9763410526137450427.1196 into 9.763 (3 display decimals)
 */
export const formatFixedNumber = (number: ethers.FixedNumber, displayDecimals = 18, decimals = 18) => {
  // Remove decimal
  const [leftSide] = number.toString().split(".");
  return formatBigNumber(BigInt(leftSide), displayDecimals, decimals);
};

export const formatDecimals = (value: string) => {
  const codeFromStorage = getLanguageCodeFromLS();
  const length = -Math.floor(Math.log10(Number(value)) + 1);
  return length >= 6
    ? length < 10
      ? `0.00${length.toString().sub()}${value.slice(length - value.length + 2)}`
      : `0.0${length.toString().sub()}${value.slice(length - value.length + 2)}`
    : length < -6
    ? new Intl.NumberFormat(codeFromStorage, {
        notation: "compact",
        compactDisplay: "short",
        maximumSignificantDigits: 2,
      }).format(Number(value))
    : value;
};

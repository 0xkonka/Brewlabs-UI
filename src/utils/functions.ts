import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { EXPLORER_NAMES, EXPLORER_URLS } from "config/constants/networks";

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const BigNumberFormat = (str: any, decimals: number = 2) => {
  if (Number(str) >= 1000000000) return `${numberWithCommas((str / 1000000000).toFixed(decimals))}B`;
  else if (Number(str) >= 1000000) return `${numberWithCommas((str / 1000000).toFixed(decimals))}M`;
  else if (Number(str) >= 1000) return `${numberWithCommas((str / 1000).toFixed(decimals))}K`;
  else return `${numberWithCommas(str.toFixed(decimals))}`;
};

export function getBlockExplorerLink(
  data: string | number,
  type: "transaction" | "token" | "address" | "block" | "countdown",
  chainId: ChainId = ChainId.ETHEREUM
): string {
  switch (type) {
    case "transaction": {
      return `${EXPLORER_URLS[chainId]}/tx/${data}`;
    }
    case "token": {
      return `${EXPLORER_URLS[chainId]}/token/${data}`;
    }
    case "block": {
      return `${EXPLORER_URLS[chainId]}/block/${data}`;
    }
    case "countdown": {
      return `${EXPLORER_URLS[chainId]}/block/countdown/${data}`;
    }
    default: {
      return `${EXPLORER_URLS[chainId]}/address/${data}`;
    }
  }
}

export const getBlockExplorerLogo = (chainId: ChainId = ChainId.ETHEREUM) => {
  return `/images/explorer/${EXPLORER_NAMES[chainId].toLowerCase()}.png`;
};

export const makeBigNumber = (amount, decimals) => {
  let decimalCount = amount.split(".")[1]?.length;
  decimalCount = decimalCount ? decimalCount : 0;
  const subDecimals = decimalCount - decimals;
  let _amount = amount;
  if (subDecimals > 0) _amount = _amount.slice(0, amount.length - subDecimals);
  return ethers.utils.parseUnits(_amount, decimals);
};

export const formatDollar = (value, decimals = 2) => {
  if (value < 0) return "-$" + (-value).toFixed(decimals);
  return "$" + value.toFixed(decimals);
};

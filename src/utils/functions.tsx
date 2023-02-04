import Skeleton from "react-loading-skeleton";
import { ethers } from "ethers";

export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const BigNumberFormat = (str: any, decimals: number = 2) => {
  if (Number(str) >= 1000000000) return `${numberWithCommas((str / 1000000000).toFixed(decimals))}B`;
  else if (Number(str) >= 1000000) return `${numberWithCommas((str / 1000000).toFixed(decimals))}M`;
  else if (Number(str) >= 1000) return `${numberWithCommas((str / 1000).toFixed(decimals))}K`;
  else return `${numberWithCommas(str.toFixed(decimals))}`;
};

export const makeBigNumber = (amount, decimals) => {
  let decimalCount = amount.split(".")[1]?.length;
  decimalCount = decimalCount ? decimalCount : 0;
  const subDecimals = decimalCount - decimals;
  let _amount = amount;
  if (subDecimals > 0) _amount = _amount.slice(0, amount.length - subDecimals);
  return ethers.utils.parseUnits(_amount, decimals);
};


export const makeSkeletonComponent = () => {
  return (
    <Skeleton
      style={{ width: "100%", maxWidth: "100px", minWidth: "50px" }}
      baseColor={"#3e3e3e"}
      highlightColor={"#686363"}
    />
  );
};

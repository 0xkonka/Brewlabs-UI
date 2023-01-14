export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const BigNumberFormat = (str: any) => {
  if (Number(str) >= 10000000000) return `${numberWithCommas((str / 1000000000).toFixed(2))}B`;
  else if (Number(str) >= 10000000) return `${numberWithCommas((str / 1000000).toFixed(2))}M`;
  else if (Number(str) >= 10000) return `${numberWithCommas((str / 1000).toFixed(2))}K`;
  else return `${numberWithCommas(str.toFixed(2))}`;
};

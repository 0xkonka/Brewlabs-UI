import { useEffect, useState } from "react";
import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

export const useBondInvestData = (dataId: string) => {
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<BondColumnsInvest[]>([]);
  const [historicData, setHistoricData] = useState<BondColumnsInvest[]>([]);

  const fetchBondInvestData = async () => {
    // Would get data from contract
    // Ideally we can use TanStack Query here too
    const mockData = [
      {
        bondChainId: 56,
        bondType: "token",
        bondToken: {
          address: "0x6aac56305825f712fd44599e59f2ede51d42c3e7",
          name: "Brewlabs",
          symbol: "BREWLABS",
          decimals: 18,
          chainId: 56,
        },
        bondSaleToken: {
          address: "0x55d398326f99059fF775485246999027B3197955",
          name: "USDT",
          symbol: "USDT",
          decimals: 18,
          chainId: 56,
        },
        bondSalePrice: 0.005676,
        bondMarketPrice: 0.0035467,
        bondVariance: {
          value: 12.5,
          direction: "up",
        },
        bondName: "BREWLABS/USDT",
        bondRemaining: {
          total: 1000,
          remaining: 998,
        },
      },
      {
        bondChainId: 1,
        bondType: "nft",
        bondToken: {
          address: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
          name: "PUDGEY PENGUINS",
          symbol: "PPG",
          decimals: 18,
          chainId: 1,
        },
        bondSaleToken: {
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          name: "USDT",
          symbol: "USDT",
          decimals: 18,
          chainId: 1,
        },
        bondSalePrice: 1000,
        bondMarketPrice: 0,
        bondVariance: {
          value: 12.5,
          direction: "up",
        },
        bondName: "PPG/USDT",
        bondRemaining: {
          total: 1,
          remaining: 1,
        },
      },
      {
        bondChainId: 56,
        bondType: "tokenVested",
        bondToken: {
          address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
          name: "Bitcoin BEP2",
          symbol: "WBTC",
          decimals: 18,
          chainId: 56,
        },
        bondSaleToken: {
          address: "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86",
          name: "OSDT",
          symbol: "OSDT",
          decimals: 18,
          chainId: 56,
        },
        bondSalePrice: 23000,
        bondMarketPrice: 0.135467,
        bondVariance: {
          value: 2,
          direction: "down",
        },
        bondVestingPeriod: 10,
        bondName: "WBTC/OUSD",
        bondRemaining: {
          total: 1000,
          remaining: 998,
        },
      },
      {
        bondType: "nft",
        bondToken: {
          address: "0x6aac56305825f712fd44599e59f2ede51d42c3e7",
          name: "Brewlabs",
          symbol: "BREWLABS",
          decimals: 18,
        },
        bondSaleToken: {
          address: "0x55d398326f99059fF775485246999027B3197955",
          name: "USDT",
          symbol: "USDT",
          decimals: 18,
        },
        bondSalePrice: 0.005676,
        bondMarketPrice: 0.0035467,
        bondVariance: {
          value: 12.5,
          direction: "up",
        },
        bondVestingPeriod: 0,
        bondName: "BREWLABS/USDC",
        bondRemaining: {
          total: 1000,
          remaining: 0,
        },
      },
    ] as BondColumnsInvest[];

    // This timeout is mock to simulate fetching data
    setTimeout(() => {
      setData(mockData.filter((item) => item.bondRemaining.remaining > 0));
      setHistoricData(mockData.filter((item) => item.bondRemaining.remaining === 0));
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    if (!dataId && dataId !== "invest") {
      return;
    }
    setIsFetching(true);
    fetchBondInvestData();
  }, [dataId]);

  return { data, historicData, isError, isFetching };
};

export default useBondInvestData;

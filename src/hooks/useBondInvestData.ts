import { useEffect, useState } from "react";
import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

export const useBondInvestData = (dataId: string) => {
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<BondColumnsInvest[]>([]);
  const [historicData, setHistoricData] = useState<BondColumnsInvest[]>([]);

  const fetchBondInvestData = async () => {
    const mockData = [
      {
        bondType: "token",
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
          amount: 12.5,
          direction: "up",
        },
        bondName: "BREWLABS/USDT",
        bondRemaining: {
          total: 1000,
          remaining: 998,
        },
      },
      {
        bondType: "tokenVested",
        bondToken: {
          address: "0x6aac56305825f712fd44599e59f2ede51d42c3e7",
          name: "Brewlabs",
          symbol: "BREWLABS",
          decimals: 18,
        },
        bondSaleToken: {
          address: "0x2A8e1E676Ec238d8A992307B495b45B3fEAa5e86",
          name: "OSDT",
          symbol: "OSDT",
          decimals: 18,
        },
        bondSalePrice: 0.005676,
        bondMarketPrice: 0.0035467,
        bondVariance: {
          amount: 2,
          direction: "down",
        },
        bondVestingPeriod: 10,
        bondName: "BREWLABS/OUSD",
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
          amount: 12.5,
          direction: "up",
        },
        bondVestingPeriod: 0,
        bondName: "BREWLABS/USDC",
        bondRemaining: {
          total: 1000,
          remaining: 1000,
        },
      },
    ] as BondColumnsInvest[];

    setTimeout(() => {
      setData(mockData.filter((item) => item.bondRemaining.remaining < item.bondRemaining.total));
      setHistoricData(mockData.filter((item) => item.bondRemaining.remaining === item.bondRemaining.total));
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

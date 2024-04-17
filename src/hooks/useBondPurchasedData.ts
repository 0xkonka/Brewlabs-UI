import { useEffect, useState } from "react";

import type { BondColumnsPurchased } from "@components/marketplace/bond-table-columns-purchased";

export const useBondPurchasedData = (dataId: string) => {
  const [data, setData] = useState<BondColumnsPurchased[]>([]);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchBondInvestData = async () => {
    // Fetch data from your API here.

    const mockData = [
      {
        bondType: "token",
        bondToken: {
          address: "0x1",
          name: "Token 1",
          symbol: "T1",
          decimals: 18,
        },
        bondSaleToken: {
          address: "0x2",
          name: "Token 2",
          symbol: "T2",
          decimals: 18,
        },
        bondSalePrice: 0.005676,
        bondMarketPrice: 0.0035467,
        bondVariance: {
          amount: 12.5,
          direction: "up",
        },
        bondVestingCountdown: 10, // Would be a date in real data
        bondName: "DOGE/USDC",
        bondClaimable: {
          total: 1000,
          remaining: 998,
        },
      },
    ] as BondColumnsPurchased[];

    setTimeout(() => {
      setData(mockData);
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    if (!dataId && dataId !== "purchased") {
      return;
    }
    setIsFetching(true);
    fetchBondInvestData();
  }, [dataId]);

  return { data, isError, isFetching };
};

export default useBondPurchasedData;

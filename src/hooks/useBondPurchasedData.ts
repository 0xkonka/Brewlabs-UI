import { useEffect, useState } from "react";

import type { BondColumnsPurchased } from "@components/marketplace/bond-table-columns-purchased";

export const useBondPurchasedData = (dataId: string) => {
  const [data, setData] = useState<BondColumnsPurchased[]>([]);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchBondPurchaseData = async () => {
    // Fetch data from your API here.

    const mockData = [
      {
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
        bondPurchaseDate: 1714560003255,
        bondMarketPrice: 0.0035467,

        bondName: "BREWLABS/USDT",
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
    fetchBondPurchaseData();
  }, [dataId]);

  return { data, isError, isFetching };
};

export default useBondPurchasedData;

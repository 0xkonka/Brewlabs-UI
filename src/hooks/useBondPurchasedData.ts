import { useEffect, useState } from "react";

import type { BondColumnsPurchased } from "@components/marketplace/bond-table-columns-purchased";

export const useBondPurchasedData = (dataId: string) => {
  const [data, setData] = useState<BondColumnsPurchased[]>([]);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchBondInvestData = async () => {
    // Fetch data from your API here.
    const returnedData = [
      {
        name: "Bond title",
        type: "token",
        marketPrice: 0.0035467,
        bondPrice: 0.005676,
        variance: {
          amount: 12.5,
          direction: "up",
        },
        vesting: "Vesting",
        claimable: "100/1000",
        actions: "Actions",
      },
      {
        name: "Bond title",
        type: "token",
        marketPrice: 0.254,
        bondPrice: 0.546345,
        variance: {
          amount: 8.3,
          direction: "down",
        },
        vesting: "Vesting",
        claimable: "84/900",
        actions: "Actions",
      },
    ] as BondColumnsPurchased[];

    setTimeout(() => {
      setData(returnedData);
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

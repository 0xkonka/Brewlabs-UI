import { useEffect, useState } from "react";
import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

export const useBondInvestData = (dataId: string) => {
  const [data, setData] = useState([]);
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
        remaining: "Remaining",
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
        remaining: "Remaining",
        actions: "Actions",
      },
    ] as BondColumnsInvest[];

    setTimeout(() => {
      setData(returnedData);
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    if (!dataId) {
      return;
    }

    setIsFetching(true);

    if (dataId === "invest") {
      fetchBondInvestData();
    }

    if (dataId === "sold") {
      setData([]);
      setIsFetching(false);

      // fetchBondSoldData();
    }

    if (dataId === "purchased") {
      setData([]);
      setIsFetching(false);
      // fetchBondPurchasedData();
    }
  }, [dataId]);

  return { data, isError, isFetching };
};

export default useBondInvestData;

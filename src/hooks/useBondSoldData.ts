import { useEffect, useState } from "react";

import type { BondColumnsSold } from "@components/marketplace/bond-table-columns-sold";

export const useBondSoldData = (dataId: string) => {
  const [data, setData] = useState<BondColumnsSold[]>([]);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchBondSoldData = async () => {
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
        sold: "100/1000",
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
        sold: "84/900",
        actions: "Actions",
      },
    ] as BondColumnsSold[];

    setTimeout(() => {
      setData(returnedData);
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    if (!dataId && dataId !== "sold") {
      return;
    }
    setIsFetching(true);
    fetchBondSoldData();
  }, [dataId]);

  return { data, isError, isFetching };
};

export default useBondSoldData;

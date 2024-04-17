import { useEffect, useState } from "react";

import type { BondColumnsSold } from "@components/marketplace/bond-table-columns-sold";

export const useBondSoldData = (dataId: string) => {
  const [data, setData] = useState<BondColumnsSold[]>([]);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchBondSoldData = async () => {
    // Fetch data from your API here.
    const returnedData = [] as BondColumnsSold[];

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

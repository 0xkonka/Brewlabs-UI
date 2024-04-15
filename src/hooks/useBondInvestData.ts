import { useEffect, useState } from "react";
import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";

export const useBondInvestData = (dataId: string) => {
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<BondColumnsInvest[]>([]);

  const fetchBondInvestData = async () => {
    // Fetch data from your API here.
    const returnedData = [
      {
        bondPair: {
          token0: {
            address: "0x123",
            name: "Token 1",
            icon: "icon",
            symbol: "BREW",
          },
          token1: {
            address: "0x456",
            name: "Token 2",
            icon: "icon",
            symbol: "USDC",
          },
          name: "Brewlabs/USDC",
        },
        type: "token",
        marketPrice: 0.0035467,
        bondPrice: 0.005676,
        variance: {
          amount: 12.5,
          direction: "up",
        },
        vesting: "7 days",
        remaining: {
          total: 1000,
          remaining: 998,
        },
        actions: "Actions",
      },
      {
        bondPair: {
          token0: {
            address: "0x123",
            name: "Token 1",
            icon: "icon",
            symbol: "BREW",
          },
          token1: {
            address: "0x456",
            name: "Token 2",
            icon: "icon",
            symbol: "USDC",
          },
          name: "Brewlabs/USDC",
        },
        type: "nft",
        marketPrice: 0.254,
        bondPrice: 0.546345,
        variance: {
          amount: 8.3,
          direction: "down",
        },
        vesting: "Instant",
        remaining: {
          total: 1000,
          remaining: 998,
        },
        actions: "Actions",
      },
    ] as BondColumnsInvest[];

    setTimeout(() => {
      setData(returnedData);
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

  return { data, isError, isFetching };
};

export default useBondInvestData;

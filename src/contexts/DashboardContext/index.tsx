/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { useActiveChainId } from "hooks/useActiveChainId";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { fetchFeaturedPrices } from "./fetchFeaturedPrices";
import { fetchTokenList } from "./fetchMarketInfo";

const DashboardContext: any = React.createContext({
  tokens: [],
  featuredPriceHistory: [],
  tokenList: [],
  pending: false,
  selectedDeployer: "",
  viewType: 0,
  chartPeriod: 0,
  setViewType: () => {},
  setSelectedDeployer: () => {},
  setPending: () => {},
  setChartPeriod: () => {},
});

const DashboardContextProvider = ({ children }: any) => {
  const { chainId } = useActiveChainId();

  const [pending, setPending] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [featuredPriceHistory, setFeaturedPriceHistory] = useState([]);
  const [selectedDeployer, setSelectedDeployer] = useState("");
  const [viewType, setViewType] = useState(0);
  const [chartPeriod, setChartPeriod] = useState(0);

  useEffect(() => {
    fetchTokenList(chainId).then((data) => setTokenList(data));
  }, [chainId]);

  useSlowRefreshEffect(() => {
    fetchFeaturedPrices()
      .then((data) => setFeaturedPriceHistory(data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        pending,
        setPending,
        tokenList,
        featuredPriceHistory,
        selectedDeployer,
        setSelectedDeployer,
        viewType,
        setViewType,
        chartPeriod,
        setChartPeriod,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardContextProvider };

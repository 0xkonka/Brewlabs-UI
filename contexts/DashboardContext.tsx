import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "config/constants";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { balanceQuery } from "./queries";
import { useAccount } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";

const DashboardContext = React.createContext({});

const url = "https://graphql.bitquery.io/";

const DashboardContextProvider = ({ children }: any) => {
  const [tokens, setTokens] = useState([]);
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  console.log(chainId);
  async function fetchTokens() {
    // fetching the token balances
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQYSfc2qeS1cjHykKpin2IR6GHPAdx0B",
      },
      body: JSON.stringify({
        query: balanceQuery,
        variables: {
          network: "ethereum",
          address,
        },
      }),
    };
    let data = await fetch(url, opts);
    data = await data.json();
    console.log(data);
  }
  useSlowRefreshEffect(() => {
    fetchTokens();
  }, [chainId]);

  return <DashboardContext.Provider value={{}}>{children}</DashboardContext.Provider>;
};

export { DashboardContext, DashboardContextProvider };

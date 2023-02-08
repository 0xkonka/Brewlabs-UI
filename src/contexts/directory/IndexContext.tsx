import { useActiveChainId } from "hooks/useActiveChainId";
import React, { useEffect, useState } from "react";
import allPools from "../../config/constants/directory/indexes.json";

const IndexContext: any = React.createContext({
  data: [],
  accountData: [],
});

const IndexContextProvider = ({ children }: any) => {
  const { chainId } = useActiveChainId();
  const pools = allPools.filter((data) => data.chainID === chainId);
  const [data, setData] = useState(pools);
  const [accountData, setAccountData] = useState(pools);

  useEffect(() => {
    setData(pools);
    setAccountData(pools);
  }, [chainId]);
  return <IndexContext.Provider value={{ data, accountData }}>{children}</IndexContext.Provider>;
};

export { IndexContext, IndexContextProvider };

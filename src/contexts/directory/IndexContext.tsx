import React, { useState } from "react";
import pools from "../../config/constants/directory/indexes.json";

const IndexContext: any = React.createContext({
  data: [],
  accountData: [],
});

const IndexContextProvider = ({ children }: any) => {
  const [data, setData] = useState(pools);
  const [accountData, setAccountData] = useState(pools);

  return <IndexContext.Provider value={{ data, accountData }}>{children}</IndexContext.Provider>;
};

export { IndexContext, IndexContextProvider };

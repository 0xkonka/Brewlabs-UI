import React, { useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";

const ChartContext: any = React.createContext({
  showFavorite: false,
  setShowFavorite: () => {},
});

const ChartContextProvider = ({ children }: any) => {
  const [showFavorite, setShowFavorite] = useState(true);
  useDefaultsFromURLSearch();

  return (
    <ChartContext.Provider
      value={{
        showFavorite,
        setShowFavorite,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartContextProvider };

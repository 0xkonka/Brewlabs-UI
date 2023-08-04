import { isArray } from "lodash";
import React, { useEffect, useState } from "react";

const ChartContext: any = React.createContext({
  favourites: [],
  setFavourites: () => {},
  onFavourites: () => {},
});

export const DEX_API_URL = process.env.NEXT_PUBLIC_DEX_API_URL;

const ChartContextProvider = ({ children }: any) => {
  const [favourites, setFavourites] = useState([]);
  const [criteria, setCriteria] = useState("");

  const getFavourites = () => {
    try {
      let _favourites: any = localStorage.getItem(`chart-favourites`);
      _favourites = JSON.parse(_favourites);
      setFavourites(isArray(_favourites) ? _favourites : []);
    } catch (error) {
      console.log(error);
    }
  };

  const onFavourites = (_address: string, chainId: number, tokenAddress: string, symbol1: string, type: number) => {
    if (type === 1) {
      const index = favourites.findIndex(
        (favourite) => favourite.address === _address && favourite.chainId === chainId
      );
      if (index !== -1) return;
      localStorage.setItem(
        `chart-favourites`,
        JSON.stringify([...favourites, { chainId, address: _address, tokenAddress, symbol1 }])
      );
      getFavourites();
    }
    if (type === 2) {
      let temp = [...favourites];

      const index = favourites.findIndex(
        (favourite) => favourite.address === _address && favourite.chainId === chainId
      );
      temp.splice(index, 1);
      localStorage.setItem(`chart-favourites`, JSON.stringify(temp));
      getFavourites();
    }
  };

  useEffect(() => {
    getFavourites();
  }, []);

  return (
    <ChartContext.Provider
      value={{
        favourites,
        onFavourites,
        criteria,
        setCriteria,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartContextProvider };

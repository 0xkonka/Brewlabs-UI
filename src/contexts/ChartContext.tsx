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

  const getFavourites = () => {
    try {
      let _favourites: any = localStorage.getItem(`chart-favourites`);
      _favourites = JSON.parse(_favourites);
      setFavourites(isArray(_favourites) ? _favourites : []);
    } catch (error) {
      console.log(error);
    }
  };

  const onFavourites = (_address: string, type: number) => {
    if (type === 1) {
      localStorage.setItem(`chart-favourites`, JSON.stringify([...favourites, _address]));
      getFavourites();
    }
    if (type === 2) {
      let temp = [...favourites];
      temp.splice(favourites.indexOf(_address), 1);
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
        setFavourites,
        onFavourites,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartContextProvider };

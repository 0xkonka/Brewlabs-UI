import axios from "axios";
import { API_URL } from "config/constants";
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
      let _favourites: any = localStorage.getItem(`chart-favorites`);
      _favourites = JSON.parse(_favourites);
      setFavourites(isArray(_favourites) ? _favourites : []);
    } catch (error) {
      console.log(error);
    }
  };

  const onFavourites = (currency: any, type: number) => {
    if (type === 1) {
      const index = favourites.findIndex(
        (favourite) => favourite.address === currency.address && favourite.chainId === currency.chainId
      );
      if (index !== -1) return;
      localStorage.setItem(`chart-favorites`, JSON.stringify([...favourites, currency]));
      getFavourites();
    }
    if (type === 2) {
      let temp = [...favourites];

      const index = favourites.findIndex(
        (favourite) => favourite.address === currency.address && favourite.chainId === currency.chainId
      );
      temp.splice(index, 1);
      localStorage.setItem(`chart-favorites`, JSON.stringify(temp));
      getFavourites();
    }
  };

  async function getScrappingSites() {
    try {
      const { data: response } = await axios.post(`${API_URL}/html/getHTML`, {
        url: "https://www.dextools.io/app/en/ether/pairs",
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getFavourites();
    // getScrappingSites();
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

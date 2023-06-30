import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";

const ChartContext: any = React.createContext({
  showFavorite: false,
  chainId: 1,
  favorites: [],
  openModal: false,
  tokenData: {},
  pairData: {},
  priceData: {},
  inputValue: null,
  setShowFavorite: () => {},
  setChainId: () => {},
  setOpenModal: () => {},
  fetchTokenData: () => {},
  fetchFavoriteData: () => {},
  setFavoriteData: () => {},
  setInputValue: () => {},
  setPriceData: () => {},
});

export const DEX_API_URL = process.env.NEXT_PUBLIC_DEX_API_URL;

const ChartContextProvider = ({ children }: any) => {
  const [showFavorite, setShowFavorite] = useState(true);
  const [chainId, setChainId] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [inputValue, setInputValue] = useState("0xdad33e12e61dc2f2692f2c12e6303b5ade7277ba");
  const [openModal, setOpenModal] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [pairData, setPairData] = useState<any>(null);
  const [priceData, setPriceData] = useState<any>(null);

  async function fetchTokenData() {
    try {
      let result = await axios.get(`${DEX_API_URL}/dexToken?address=${inputValue}&network=ether`);

      console.log(result);
      if (result.data) {
        setTokenData(result.data);

        let pairResult = await axios.get(
          `${DEX_API_URL}/dexPair?address=${result.data.data.reprPair.id.pair}&network=ether`
        );
        if (pairResult.data) {
          setPairData(pairResult.data);
        } else setPairData(null);
      } else setTokenData(null);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchPriceData() {
    try {
      let result = await axios.get(`${DEX_API_URL}/dexPrice?address=${inputValue}&network=ethereum`);

      if (result.data) {
        setPriceData(result.data);
      } else setPriceData(null);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchFavoriteData() {
    try {
      var favorites_storage = JSON.parse(localStorage.getItem("brewlabs_favorite"));
      console.log("favorites_storage", favorites_storage);
      favorites_storage.length > 0 && setFavorites(favorites_storage);
    } catch (e) {
      console.log(e);
    }
  }

  function setFavoriteData(fav) {
    try {
      if (favorites.includes(fav)) {
        var favorite_new = favorites.filter((favorite) => favorite != fav);
        setFavorites(favorite_new);
        localStorage.setItem("brewlabs_favorite", JSON.stringify(favorite_new));
      } else {
        setFavorites([...favorites, fav]);
        localStorage.setItem("brewlabs_favorite", JSON.stringify([...favorites, fav]));
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ChartContext.Provider
      value={{
        showFavorite,
        chainId,
        favorites,
        openModal,
        tokenData,
        pairData,
        inputValue,
        priceData,
        setShowFavorite,
        setChainId,
        setFavorites,
        setOpenModal,
        fetchTokenData,
        fetchPriceData,
        fetchFavoriteData,
        setFavoriteData,
        setInputValue,
        setPriceData,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartContextProvider };

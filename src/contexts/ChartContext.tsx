import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";

const ChartContext: any = React.createContext({
  showFavorite: false,
  chainId: 1,
  favorites: [],
  openModal: false,
  tokenData:{},
  pairData:{},
  inputValue:null,
  setShowFavorite: () => {},
  setChainId: () => {},
  setFavorites: () => {},
  setOpenModal: () => {},
  fetchTokenData: () => {},
  setInputValue: () => {}
});

export const DEX_API_URL = "https://api.dextools.io/v1";
const instance = axios.create({ baseURL: DEX_API_URL });

const ChartContextProvider = ({ children }: any) => {
  const [showFavorite, setShowFavorite] = useState(true);
  const [chainId, setChainId] = useState(1);
  const [favorites, setFavorites] = useState([
    'BREWLABS WBNB',
    'BREWLABS ETH',
    'BREWLABS Fantom',
    'BREWLABS Cronos',
  ]);
  const [inputValue, setInputValue] = useState('0x6aac56305825f712fd44599e59f2ede51d42c3e7');
  const [openModal, setOpenModal] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [pairData, setPairData] = useState<any>(null);

  async function fetchTokenData() {
    try {
      const headers = {
        "X-API-Key": "22c48f5c7aae59ce568d1b5a4990b924",
        'Content-Type': "application/json",
        'accept': "application/json",
      }
      let result = await instance.get(
        `/token`,
        {
          params: {
            "chain": "bsc",
            "address": inputValue,
            "page": 0,
            "pageSize": 50
          },
          headers
        }
      );      

      console.log(result);
      if (result.data) {
        setTokenData(result.data);
        

        const pairResult = await instance.get(
          `/pair`,
          {
            params: {
              "chain": "bsc",
              "address": result.data.data.reprPair.id.pair,
            },
            headers
          }
        );
        console.log(pairResult.data);
        if(pairResult.data){
          setPairData(pairResult.data);
        }
        else setPairData(null);
      }
      else setTokenData(null);
    } catch (e) {
      console.log(e);
    }
  }

  useDefaultsFromURLSearch();

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
        setShowFavorite,
        setChainId,
        setFavorites,
        setOpenModal,
        fetchTokenData,
        setInputValue
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartContextProvider };

import React, { useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";

const ChartContext: any = React.createContext({
  showFavorite: false,
  chainId: 1,
  favorites: [],
  openModal: false,
  setShowFavorite: () => {},
  setChainId: () => {},
  setFavorites: () => {},
  setOpenModal: () => {}
});

const ChartContextProvider = ({ children }: any) => {
  const [showFavorite, setShowFavorite] = useState(true);
  const [chainId, setChainId] = useState(1);
  const [favorites, setFavorites] = useState([
    'BREWLABS WBNB',
    'BREWLABS ETH',
    'BREWLABS Fantom',
    'BREWLABS Cronos',
  ]);
  const [openModal, setOpenModal] = useState(false);

  useDefaultsFromURLSearch();

  return (
    <ChartContext.Provider
      value={{
        showFavorite,
        chainId,
        favorites,
        openModal,
        setShowFavorite,
        setChainId,
        setFavorites,
        setOpenModal
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export { ChartContext, ChartContextProvider };

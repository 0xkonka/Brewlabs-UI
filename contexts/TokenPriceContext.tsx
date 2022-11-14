import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "config/constants";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";

const TokenPriceContext = React.createContext({
  prices: {} as { [key: string]: number },
  tokenPrices: {} as { [key: string]: number },
  lpPrices: {} as { [key: string]: number },
});

const TokenPriceContextProvider = ({ children }: any) => {
  const [prices, setPrices] = useState({});
  const [tokenPrices, setTokenPrices] = useState({});
  const [lpPrices, setLPPrices] = useState({});

  useSlowRefreshEffect(() => {
    axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=brewlabs&vs_currencies=usd`).then((res) => {
      setPrices(res.data);
    });
  }, []);

  useSlowRefreshEffect(() => {
    axios.get(`${API_URL}/prices`).then((res) => {
      if (res.data?.tokenPrices) setTokenPrices(res.data.tokenPrices);
      if (res.data?.lpPrices) setLPPrices(res.data.lpPrices);
    });
  }, []);

  return <TokenPriceContext.Provider value={{ prices, tokenPrices, lpPrices }}>{children}</TokenPriceContext.Provider>;
};

export { TokenPriceContext, TokenPriceContextProvider };

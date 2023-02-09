import axios from "axios";
import { useActiveChainId } from "hooks/useActiveChainId";
import React, { useEffect, useState } from "react";
import allPools from "../../config/constants/directory/indexes.json";

const IndexContext: any = React.createContext({
  data: [],
  accountData: [],
  rate: 0,
});

const IndexContextProvider = ({ children }: any) => {
  const { chainId } = useActiveChainId();
  const pools = allPools.filter((data) => data.chainID === chainId);
  const [data, setData] = useState(pools);
  const [accountData, setAccountData] = useState(pools);
  const [rate, setRate] = useState(0);

  async function fetchPrice() {
    const to = Math.floor(Date.now() / 1000);

    //Fetching Staking Token Price
    const OGNUrl = `https://api.dex.guru/v1/tradingview/history?symbol=0x8207c1ffc5b6804f6024322ccf34f29c3541ae26-eth_USD&resolution=1440&from=${to - 3600 * 24 * 365}&to=${to}`;

    console.log(OGNUrl);
    let priceResult = await axios.get(OGNUrl);
    let prevPrice = priceResult.data.c[0];
    let currentPrice = priceResult.data.c[priceResult.data.c.length - 1];

    console.log(prevPrice, currentPrice);
    const ognChange = ((currentPrice - prevPrice) / currentPrice) * 100;

    const OGVUrl = `https://api.dex.guru/v1/tradingview/history?symbol=0x9c354503c38481a7a7a51629142963f98ecc12d0-eth_USD&resolution=1440&from=${to - 3600 * 24 * 365}&to=${to}`;

    priceResult = await axios.get(OGVUrl);
    prevPrice = priceResult.data.c[0];
    currentPrice = priceResult.data.c[priceResult.data.c.length - 1];
    console.log(prevPrice, currentPrice);

    const ogvChange = ((currentPrice - prevPrice) / currentPrice) * 100 ;

    setRate((ognChange + ogvChange) / 2);
  }

  useEffect(() => {
    setData(pools);
    setAccountData(pools);
    fetchPrice();
  }, [chainId]);
  return <IndexContext.Provider value={{ data, accountData, rate }}>{children}</IndexContext.Provider>;
};

export { IndexContext, IndexContextProvider };

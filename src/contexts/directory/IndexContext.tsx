import axios from "axios";
import { useActiveChainId } from "hooks/useActiveChainId";
import React, { useEffect, useState } from "react";
import pools from "../../config/constants/directory/indexes.json";

const IndexContext: any = React.createContext({
  data: [],
  accountData: [],
  rate: [0],
  rateHistory: [],
});

const IndexContextProvider = ({ children }: any) => {
  const { chainId } = useActiveChainId();
  const [data, setData] = useState(pools);
  const [accountData, setAccountData] = useState(pools);
  const [rate, setRate] = useState([
    {
      percent: 0,
      value: 0,
    },
    {
      percent: 0,
      value: 0,
    },
    {
      percent: 0,
      value: 0,
    },
    {
      percent: 0,
      value: 0,
    },
  ]);
  const [rateHistory, setRateHistory] = useState([0]);

  const getPriceChange = (price1, price2, time) => {
    const currentPrice1 = price1.c[price1.c.length - 1];
    const currentPrice2 = price2.c[price2.c.length - 1];
    let prevPrice1 = 0;
    let prevPrice2 = 0;
    for (let i = price1.t.length; i >= 0; i--)
      if (price1.t[i] < (Date.now() - time) / 1000) {
        prevPrice1 = price1.c[i];
        break;
      }

    for (let i = price2.t.length; i >= 0; i--)
      if (price2.t[i] < (Date.now() - time) / 1000) {
        prevPrice2 = price2.c[i];
        break;
      }
    const currentPriceChange = (currentPrice1 + currentPrice2) / 2;
    const prevPriceChange = (prevPrice1 + prevPrice2) / 2;
    return {
      percent: ((currentPriceChange - prevPriceChange) / currentPriceChange) * 100,
      value: currentPriceChange - prevPriceChange,
    };
  };

  const getHistory = (price1, price2) => {
    let temp = [];
    for (let i = 0; i < price1.length; i++) {
      const currentPriceChange = (price1[i] + price2[i]) / 2;
      const prevPriceChange = (price1[0] + price2[0]) / 2;
      const average = ((currentPriceChange - prevPriceChange) / currentPriceChange) * 100;
      temp.push(average);
    }
    return temp;
  };
  async function fetchPrice() {
    const to = Math.floor(Date.now() / 1000);

    //Fetching Staking Token Price
    const OGNUrl = `https://api.dex.guru/v1/tradingview/history?symbol=0x8207c1ffc5b6804f6024322ccf34f29c3541ae26-eth_USD&resolution=1440&from=${
      to - 3600 * 24 * 365
    }&to=${to}`;

    let priceResult = await axios.get(OGNUrl);
    const OGNPrice = priceResult.data;

    const OGVUrl = `https://api.dex.guru/v1/tradingview/history?symbol=0x9c354503c38481a7a7a51629142963f98ecc12d0-eth_USD&resolution=1440&from=${
      to - 3600 * 24 * 365
    }&to=${to}`;

    priceResult = await axios.get(OGVUrl);
    const OGVPrice = priceResult.data;

    const OGNDayUrl = `https://api.dex.guru/v1/tradingview/history?symbol=0x8207c1ffc5b6804f6024322ccf34f29c3541ae26-eth_USD&resolution=60&from=${
      to - 3600 * 24
    }&to=${to}`;

    priceResult = await axios.get(OGNDayUrl);
    const OGNDayPrice = priceResult.data;

    const OGVDayUrl = `https://api.dex.guru/v1/tradingview/history?symbol=0x9c354503c38481a7a7a51629142963f98ecc12d0-eth_USD&resolution=60&from=${
      to - 3600 * 24
    }&to=${to}`;

    priceResult = await axios.get(OGVDayUrl);
    const OGVDayPrice = priceResult.data;

    setRate([
      getPriceChange(OGNPrice, OGVPrice, 364 * 86400 * 1000),
      getPriceChange(OGNPrice, OGVPrice, 30 * 86400 * 1000),
      getPriceChange(OGNPrice, OGVPrice, 7 * 86400 * 1000),
      getPriceChange(OGNDayPrice, OGVDayPrice, 3600 * 23 * 1000),
    ]);

    setRateHistory(getHistory(OGNDayPrice.c, OGVDayPrice.c));
  }

  useEffect(() => {
    setData(pools);
    setAccountData(pools);
    fetchPrice();
  }, [chainId]);
  return <IndexContext.Provider value={{ data, accountData, rate, rateHistory }}>{children}</IndexContext.Provider>;
};

export { IndexContext, IndexContextProvider };

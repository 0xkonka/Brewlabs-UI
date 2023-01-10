import { useState, useEffect } from "react";
import axios from "axios";

const useTokenMarketChart = (tokenId: string | undefined) => {
  const [priceChange24h, setPriceChange24h] = useState(undefined);
  const [tokenPrice, setTokenPriceUsd] = useState(Number);

  useEffect(() => {
    if (!tokenId) return;
    axios.get(`https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=1`).then((res) => {
      if (res.data) {
        const { prices: historicalPrices } = res.data;

        const _currentPrice = historicalPrices[historicalPrices.length - 1][1];
        const _24hPastPrice = historicalPrices[0][1];

        setPriceChange24h(((_currentPrice - _24hPastPrice) / _24hPastPrice) * 100);
        setTokenPriceUsd(_currentPrice);
      }
    });
  }, [tokenId]);

  return {priceChange24h, tokenPrice};
};

export default useTokenMarketChart;

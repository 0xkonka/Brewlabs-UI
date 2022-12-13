import { useState, useEffect } from "react";
import axios from "axios";

const useCoingeckoTokenId = (symbol: string | undefined) => {
  const [tokenId, setTokenId] = useState(undefined);

  useEffect(() => {
    if (!symbol) return;
    axios.get(`https://api.coingecko.com/api/v3/coins/list`).then((res) => {
      if (res.data) {
        const tokens = res.data;
        const token = tokens.find((token) => token.symbol.toUpperCase() === symbol.toUpperCase());
        if (token) setTokenId(token.id);
      }
    });
  }, [symbol]);

  return tokenId;
};

export default useCoingeckoTokenId;

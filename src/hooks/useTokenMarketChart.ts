import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { CG_API, CG_PRO_API } from "config/constants/endpoints";
import CG_ASSET_PLATFORMS from "config/constants/tokens/CGAssetPlatforms.json";
import { ChainId } from "@brewlabs/sdk";
import { API_URL } from "config/constants";

export interface TokenMarketData {
  [address: string]: {
    usd: number;
    usd_24h_change: number | null;
  };
}

export const defaultMarketData = {
  usd: 0,
  usd_24h_change: null,
};

const useTokenMarketChart = (chainId: ChainId): TokenMarketData => {

  const [data, setData] = useState({});
  useEffect(() => {
    axios
      .get(
        `${API_URL}/cg/prices?chainId=${chainId}`
      )
      .then((res) => {
        if (res.data) {
          const {prices} = res.data;
          setData(prices);
        }
      })
      .catch((e) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return data;
};

export default useTokenMarketChart;

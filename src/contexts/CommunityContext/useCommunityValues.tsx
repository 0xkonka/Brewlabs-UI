import { useContext } from "react";
import { formatEther } from "viem";

import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useFarms } from "state/farms/hooks";
import { useIndexes } from "state/indexes/hooks";
import { usePools } from "state/pools/hooks";
import getCurrencyId from "utils/getCurrencyId";

export const useCommunuityValues = () => {
  const totalStakedValues = useTotalStakedValues();
  return { totalStakedValues };
};

const useTotalStakedValues = () => {
  const { pools } = usePools();
  const { data: farms } = useFarms();
  const { indexes } = useIndexes();

  const { tokenPrices, lpPrices } = useContext(TokenPriceContext);
  const allPools = [
    ...pools
      .filter((p) => p.visible)
      .map((pool) => {
        let price = tokenPrices[getCurrencyId(pool.chainId, pool.stakingToken.address)];
        if (price > 500000) price = 0;
        return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
      }),
    ...farms
      .filter((p) => p.visible)
      .map((farm) => {
        let price = lpPrices[getCurrencyId(farm.chainId, farm.lpAddress, true)];
        return { ...farm, tvl: farm.totalStaked && price ? +formatEther(farm.totalStaked).toString() * price : 0 };
      }),
    ...indexes
      .filter((p) => p.visible)
      .sort((a, b) => (b.category === undefined ? 0 : 1) - (a.category === undefined ? 0 : 1))
      .map((_index) => {
        let tvl = 0;
        for (let i = 0; i < _index.tokens.length; i++) {
          let price = _index.tokenPrices?.[i] ?? tokenPrices[getCurrencyId(_index.chainId, _index.tokens[i].address)];
          tvl += _index.totalStaked?.[i] && price ? +_index.totalStaked[i] * price : 0;
        }
        return { ..._index, tvl };
      }),
  ];

  let tvl = 0;
  allPools.map((data) => (tvl += data.tvl));
  return { value: tvl, changedValue: tvl / 999 };
};

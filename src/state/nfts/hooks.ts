import { useEffect } from "react";
import { useSelector } from "react-redux";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { simpleRpcProvider } from "utils/providers";

import { State } from "../types";
import { NftStakingData } from "./type";

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();

  useSlowRefreshEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await simpleRpcProvider(chainId).getBlockNumber();
      // dispatch(fetchPoolsPublicDataAsync(blockNumber, chainId));
    };

    fetchPoolsPublicData();
  }, [dispatch, chainId]);
};

export const useNftPools = (): { pools: NftStakingData[]; userDataLoaded: boolean } => {
  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.nfts.data,
    userDataLoaded: state.nfts.userDataLoaded,
  }));
  return { pools, userDataLoaded };
};


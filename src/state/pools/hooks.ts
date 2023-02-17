import { useEffect } from "react";
import { useSelector } from "react-redux";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { simpleRpcProvider } from "utils/providers";

import { State } from "../types";
import { fetchPoolsPublicDataAsync, fetchPoolsPublicDataFromApiAsync, fetchPoolsUserDataAsync } from ".";
import { transformPool } from "./helpers";
import { DeserializedPool } from "./types";

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();

  useSlowRefreshEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await simpleRpcProvider(chainId).getBlockNumber();
      dispatch(fetchPoolsPublicDataAsync(blockNumber, chainId));
    };

    fetchPoolsPublicData();
  }, [dispatch, chainId]);
};

export const usePollPoolsPublicDataFromApi = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchPoolsPublicDataFromApiAsync());
  }, [dispatch]);
};

export const useFetchPoolsWithUserData = () => {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  useSlowRefreshEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account, chainId));
    }
  }, [account, chainId, dispatch]);
};

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean } => {
  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }));
  return { pools: pools.map(transformPool), userDataLoaded };
};

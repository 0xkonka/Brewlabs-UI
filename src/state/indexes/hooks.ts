import { useEffect } from "react";
import { useSelector } from "react-redux";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { State } from "state/types";

import {
  fetchIndexesFromApiAsync,
  fetchIndexesPublicDataAsync,
  fetchIndexesUserDataAsync,
  fetchIndexesUserHistoryDataAsync,
  resetIndexesUserData,
} from ".";
import { DeserializedIndex } from "./types";
import { transformIndex } from "./helpers";

export const usePollIndexesFromApi = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIndexesFromApiAsync());
  }, [dispatch]);
};

export const useFetchPublicIndexesData = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useActiveWeb3React();

  useSlowRefreshEffect(() => {
    dispatch(fetchIndexesPublicDataAsync(chainId));
  }, [chainId]);
};

export const useFetchIndexesWithUserData = () => {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  useSlowRefreshEffect(() => {
    if (account) {
      dispatch(fetchIndexesUserDataAsync(account, chainId));
      dispatch(fetchIndexesUserHistoryDataAsync(account));
    } else {
      dispatch(resetIndexesUserData());
    }
  }, [account, chainId, dispatch]);
};

export const useIndexes = (): { indexes: DeserializedIndex[]; userDataLoaded: boolean } => {
  const { indexes, userDataLoaded } = useSelector((state: State) => ({
    indexes: state.indexes.data,
    userDataLoaded: state.indexes.userDataLoaded,
  }));
  return { indexes: indexes.map(transformIndex), userDataLoaded };
};

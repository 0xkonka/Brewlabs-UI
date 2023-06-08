import { useEffect } from "react";
import { useSelector } from "react-redux";

import contracts from "config/constants/contracts";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { useAppDispatch } from "state";
import { State } from "state/types";
import { fetchFarmFactoryDataAsync } from ".";

export const usePollFarmFactoryData = () => {
  const dispatch = useAppDispatch();

  const supportedChains = PAGE_SUPPORTED_CHAINS["deployer"].filter((chainId) =>
    Object.keys(contracts.farmFactory)
      .map((c) => +c)
      .includes(chainId)
  );

  useEffect(() => {
    supportedChains.forEach((chainId) => dispatch(fetchFarmFactoryDataAsync(chainId)));
  }, [dispatch]);
};

export const useFarmFactories = (chainId) =>
  useSelector((state: State) => state.deploy.farm.find((data) => data.chainId === chainId));

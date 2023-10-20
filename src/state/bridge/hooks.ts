import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

import { bridgeConfigs } from "config/constants/bridge";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";
import { State } from "state/types";
import { fetchAmbDataAsync, fetchMediatorUserDataAsync, fetchMeidatorDataAsync, resetUserData } from ".";

export const useFetchBridgeData = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();

  useEffect(() => {
    dispatch(fetchAmbDataAsync());
    dispatch(fetchMeidatorDataAsync());
  }, []);

  useSlowRefreshEffect(() => {
    if (address) {
      dispatch(fetchMediatorUserDataAsync(address));
    } else {
      bridgeConfigs.forEach((config) => {
        dispatch(resetUserData(config.bridgeDirectionId));
      });
    }
  }, [address]);
};

export const useBridgeInfo = (bridgeId) => useSelector((state: State) => state.bridge.data[bridgeId]);

import { useCallback, useEffect, useMemo } from "react";
import { ChainId } from "@brewlabs/sdk";

import { bridgeConfigs } from "config/constants/bridge";
import { setGlobalState, useGlobalState } from "state";
import { useAmbVersion } from "./useAmbVersion";
import { useTotalConfirms } from "./useTotalConfirms";
import { useValidatorsContract } from "./useValidatorsContract";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useRouter } from "next/router";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import replaceBrowserHistory from "utils/replaceBrowserHistory";

export const useBridgeDirection = (fromChainId?: ChainId, fromTokenAddress?: string, toChainId?: ChainId) => {
  const bridgeConfig = useMemo(() => {
    let configs = bridgeConfigs.filter(
      (c) =>
        (c.homeChainId === fromChainId && c.homeToken.address === fromTokenAddress) ||
        (c.foreignChainId === fromChainId && c.foreignToken.address === fromTokenAddress)
    );

    if (configs.length > 0) {
      let config = configs.find(
        (c) =>
          (c.homeChainId === fromChainId && c.foreignChainId === toChainId) ||
          (c.foreignChainId === fromChainId && c.homeChainId === toChainId)
      );

      return config ?? configs[0];
    } else {
      let config = bridgeConfigs.find((c) => c.homeChainId === fromChainId || c.foreignChainId === fromChainId);
      return config ?? bridgeConfigs[0];
    }
  }, [fromChainId, fromTokenAddress, toChainId]);

  const { homeChainId, foreignChainId, homeGraphName, foreignGraphName, homeAmbAddress, foreignAmbAddress } =
    bridgeConfig;

  const foreignAmbVersion = useAmbVersion(foreignChainId, foreignAmbAddress);

  const { requiredSignatures, validatorList } = useValidatorsContract(foreignChainId, foreignAmbAddress);

  const { homeTotalConfirms, foreignTotalConfirms } = useTotalConfirms(
    homeChainId,
    foreignChainId,
    homeAmbAddress,
    foreignAmbAddress
  );

  const getBridgeChainId = useCallback(
    (chainId: ChainId) => (chainId === homeChainId ? foreignChainId : homeChainId),
    [homeChainId, foreignChainId]
  );

  const getGraphEndpoint = useCallback(
    (chainId: ChainId) => {
      const subgraphName = homeChainId === chainId ? homeGraphName : foreignGraphName;
      return `https://api.thegraph.com/subgraphs/name/${subgraphName}`;
    },
    [foreignGraphName, homeChainId, homeGraphName]
  );

  const getAMBAddress = useCallback(
    (chainId: ChainId) => (chainId === homeChainId ? homeAmbAddress : foreignAmbAddress),
    [homeChainId, homeAmbAddress, foreignAmbAddress]
  );

  const getTotalConfirms = useCallback(
    (chainId: ChainId) => (chainId === homeChainId ? homeTotalConfirms : foreignTotalConfirms),
    [homeChainId, homeTotalConfirms, foreignTotalConfirms]
  );

  return {
    ...bridgeConfig,
    getBridgeChainId,
    getGraphEndpoint,
    getAMBAddress,
    foreignAmbVersion,
    homeTotalConfirms,
    foreignTotalConfirms,
    getTotalConfirms,
    requiredSignatures,
    validatorList,
  };
};

export const useFromChainId = () => {
  const [networkFrom] = useGlobalState("userBridgeFrom");
  const { chainId } = useActiveChainId();
  const { query } = useRouter();

  let fromChainId = +(query.chainId ?? (+networkFrom > 0 ? networkFrom : chainId));

  useEffect(() => {
    if (!PAGE_SUPPORTED_CHAINS["bridge"].includes(fromChainId)) {
      fromChainId = +networkFrom > 0 ? +networkFrom : PAGE_SUPPORTED_CHAINS["bridge"][0];
      replaceBrowserHistory("chainId", fromChainId.toString());
      setGlobalState("userBridgeFrom", fromChainId.toString());
      setGlobalState("sessionChainId", fromChainId.toString())
    } else if (fromChainId !== +networkFrom) {
      setGlobalState("userBridgeFrom", fromChainId.toString());
    }
  }, [query.chainId, fromChainId, networkFrom]);

  return fromChainId;
};

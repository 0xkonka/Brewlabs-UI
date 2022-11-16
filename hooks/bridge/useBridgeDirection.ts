import { useCallback, useEffect, useMemo } from "react";
import { ChainId } from "@brewlabs/sdk";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import { bridgeConfigs } from "config/constants/bridge";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useReplaceQueryParams } from "hooks/useReplaceQueryParams";
import { setGlobalState, useGlobalState } from "state";
import { useAmbVersion } from "./useAmbVersion";
import { useTotalConfirms } from "./useTotalConfirms";
import { useValidatorsContract } from "./useValidatorsContract";

export const useBridgeDirection = () => {
  const [fromChainId] = useGlobalState("userBridgeFrom");
  const [toChainId] = useGlobalState("userBridgeTo");
  const [fromToken] = useGlobalState("userBridgeFromToken");

  const bridgeConfig = useMemo(() => {
    const config = bridgeConfigs.find(
      (c) =>
        (c.homeChainId === fromChainId &&
          c.homeToken.address === fromToken?.address &&
          c.foreignChainId === toChainId) ||
        (c.foreignChainId === fromChainId &&
          c.foreignToken.address === fromToken?.address &&
          c.homeChainId === toChainId)
    );

    return config ?? bridgeConfigs[0];
  }, [fromChainId, fromToken?.address, toChainId]);

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
  const { chain } = useNetwork();
  const { chainId } = useActiveChainId();
  const { query } = useRouter();
  const { replaceQueryParams } = useReplaceQueryParams();

  const [networkFrom] = useGlobalState("userBridgeFrom");

  let fromChainId = +(query.chainId ?? (+networkFrom > 0 ? networkFrom : chainId));

  useEffect(() => {
    if (!PAGE_SUPPORTED_CHAINS["bridge"].includes(chain?.id ?? 0)) {
      fromChainId = +networkFrom > 0 ? +networkFrom : PAGE_SUPPORTED_CHAINS["bridge"][0];
      replaceQueryParams("chainId", fromChainId.toString());
      setGlobalState("userBridgeFrom", fromChainId);
      setGlobalState("sessionChainId", fromChainId.toString());
    } else if (fromChainId !== +networkFrom) {
      setGlobalState("userBridgeFrom", fromChainId);
    }
  }, [chain, fromChainId, networkFrom]);

  return fromChainId;
};

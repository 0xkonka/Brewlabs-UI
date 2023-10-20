import { useCallback, useEffect, useMemo } from "react";
import { ChainId } from "@brewlabs/sdk";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";

import { bridgeConfigs } from "config/constants/bridge";
import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import { useActiveChainId } from "hooks/useActiveChainId";
import { setGlobalState, useGlobalState } from "state";

import { useAmbVersion } from "./useAmbVersion";
import { useTotalConfirms } from "./useTotalConfirms";
import { useValidatorsContract } from "./useValidatorsContract";
import { useBridgeInfo } from "state/bridge/hooks";

export const useBridgeDirection = () => {
  const [fromChain] = useGlobalState("userBridgeFrom");
  const [toChain] = useGlobalState("userBridgeTo");
  const [fromToken] = useGlobalState("userBridgeFromToken");

  const bridgeConfig = useMemo(() => {
    const config = bridgeConfigs.find(
      (c) =>
        (c.homeChainId === fromChain.id &&
          c.homeToken.address === fromToken?.address &&
          c.foreignChainId === toChain.id) ||
        (c.foreignChainId === fromChain.id &&
          c.foreignToken.address === fromToken?.address &&
          c.homeChainId === toChain.id)
    );

    return config ?? bridgeConfigs[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain, fromToken?.address, toChain]);

  const { homeChainId, foreignChainId, homeGraphName, foreignGraphName, homeAmbAddress, foreignAmbAddress } =
    bridgeConfig;

  const bridgeData = useBridgeInfo(bridgeConfig.bridgeDirectionId);
  const { ambData } = bridgeData;

  // const foreignAmbVersion = useAmbVersion(foreignChainId, foreignAmbAddress);
  // const {requiredSignatures, validatorList}= useValidatorsContract(foreignChainId, foreignAmbAddress);

  const { version: foreignAmbVersion, requiredSignatures, validatorList } = ambData[foreignChainId];

  // const { homeTotalConfirms, foreignTotalConfirms } = useTotalConfirms(
  //   homeChainId,
  //   foreignChainId,
  //   homeAmbAddress,
  //   foreignAmbAddress
  // );
  const homeTotalConfirms = ambData[homeChainId].requiredBlockConfirmations;
  const foreignTotalConfirms = ambData[foreignChainId].requiredBlockConfirmations;

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
    ...bridgeData,
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
  const { chainId } = useActiveChainId();
  const { chain } = useNetwork();
  const { query } = useRouter();

  const [networkFrom] = useGlobalState("userBridgeFrom");

  let fromChainId = +(query.chainId ?? chainId);
  useEffect(() => {
    if (!PAGE_SUPPORTED_CHAINS["bridge"].includes(fromChainId ?? 0)) {
      fromChainId = networkFrom.id > 0 ? networkFrom.id : PAGE_SUPPORTED_CHAINS["bridge"][0];
      // replaceQueryParams("chainId", fromChainId.toString());
      setGlobalState("userBridgeFrom", NetworkOptions.find((n) => n.id === fromChainId)!);
      setGlobalState("sessionChainId", fromChainId.toString());
    } else if (fromChainId !== networkFrom.id) {
      setGlobalState("userBridgeFrom", NetworkOptions.find((n) => n.id === fromChainId)!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, fromChainId, networkFrom]);

  return fromChainId;
};

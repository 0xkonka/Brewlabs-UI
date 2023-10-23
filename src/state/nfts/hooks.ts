import { ChainId } from "@brewlabs/sdk";
import { useSelector } from "react-redux";

import contracts from "config/constants/contracts";
import { PAGE_SUPPORTED_CHAINS } from "config/constants/networks";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useSlowRefreshEffect } from "hooks/useRefreshEffect";
import { useAppDispatch } from "state";

import { State } from "../types";
import { FlaskNftData, MirrorNftData, NftStakingData } from "./type";
import { fetchNftPublicDataAsync, fetchNftUserDataAsync, resetNftUserData } from ".";

export const useFetchPublicNftData = () => {
  const dispatch = useAppDispatch();

  const supportedChains = PAGE_SUPPORTED_CHAINS["nft"].filter((chainId) =>
    Object.keys(contracts.flaskNft)
      .map((c) => +c)
      .includes(chainId)
  );
  useSlowRefreshEffect(() => {
    supportedChains.forEach((chainId) => dispatch(fetchNftPublicDataAsync(chainId)));
  }, [dispatch]);
};

export const useFetchNftUserData = () => {
  const dispatch = useAppDispatch();
  const { account } = useActiveWeb3React();

  const supportedChains = PAGE_SUPPORTED_CHAINS["nft"].filter((chainId) =>
    Object.keys(contracts.flaskNft)
      .map((c) => +c)
      .includes(chainId)
  );
  useSlowRefreshEffect(() => {
    if (account) {
      supportedChains.forEach((chainId) => dispatch(fetchNftUserDataAsync(chainId, "0xC7b36d58A4Da7D26E8c4889529D1fA8313a6E20D")));
    } else {
      dispatch(resetNftUserData());
    }
  }, [dispatch, account]);
};

export const useNftPools = (): { pools: NftStakingData[]; userDataLoaded: boolean } => {
  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.nfts.data,
    userDataLoaded: state.nfts.userDataLoaded,
  }));
  return { pools, userDataLoaded };
};

export const useNftPool = (chainId: ChainId): { pool?: NftStakingData; userDataLoaded: boolean } => {
  const { pool, userDataLoaded } = useSelector((state: State) => ({
    pool: state.nfts.data.find((p) => p.chainId === chainId) ?? state.nfts.data[0],
    userDataLoaded: state.nfts.userDataLoaded,
  }));
  return { pool, userDataLoaded };
};

export const useFlaskNftData = (chainId: ChainId): FlaskNftData => {
  return useSelector(
    (state: State) => state.nfts.flaskNft.find((nft) => nft.chainId === chainId) ?? state.nfts.flaskNft[0]
  );
};

export const useMirrorNftData = (chainId: ChainId): MirrorNftData => {
  return useSelector(
    (state: State) => state.nfts.mirrorNft.find((nft) => nft.chainId === chainId) ?? state.nfts.mirrorNft[0]
  );
};

export const useAllNftData = () => useSelector((state: State) => state.nfts);

import { useMemo } from "react";
// Imports below migrated from Exchange useContract.ts
import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { Address } from "viem";
import { erc20ABI, useWalletClient } from "wagmi";

import { ERC20_BYTES32_ABI } from "config/abi/erc20";
import ENS_PUBLIC_RESOLVER_ABI from "config/abi/ens-public-resolver.json";
import ENS_ABI from "config/abi/ens-registrar.json";
import WETH_ABI from "config/abi/weth";
import LpTokenAbi from "config/abi/lpToken.json";
import multiCallAbi from "config/abi/Multicall";
import ConstructorABI from "config/abi/tokenTransfer.json";
import ExternalMasterChefABI from "config/abi/externalMasterchef";

import { Chef } from "config/constants/types";
import { useAppId } from "state/zap/hooks";

import { getExternalMasterChefAddress, getMulticallAddress, getTokenTransferAddress } from "utils/addressHelpers";
import {
  getBep20Contract,
  getMasterchefContract,
  getErc721Contract,
  getSingleStakingContract,
  getLockupStakingContract,
  getContract,
  getIndexContract,
  getBrewlabsFeeManagerContract,
  getFarmFactoryContract,
  getFarmImplContract,
  getIndexFactoryContract,
  getOldIndexContract,
  getFlaskNftContract,
  getMirrorNftContract,
  getNftStakingContract,
  getSidContract,
  getUnsContract,
  getBrewlabsRouterContract,
} from "utils/contractHelpers";

import { useActiveChainId } from "./useActiveChainId";

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: Address) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useWalletClient();
  return useMemo(() => getBep20Contract(chainId, address, signer), [address, signer, chainId]);
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useWalletClient();
  return useMemo(() => getErc721Contract(chainId, address, signer), [address, signer, chainId]);
};

export const useMasterchef = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useWalletClient();
  return useMemo(() => getMasterchefContract(chainId, address, signer), [address, signer, chainId]);
};

export const useFarmContract = (address: string) => {
  const { chainId } = useActiveChainId();
  const { data: signer } = useWalletClient();
  return useMemo(() => getFarmImplContract(chainId, address, signer), [address, signer, chainId]);
};

export const useSingleStaking = (chainId: ChainId, contractAddress: string) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getSingleStakingContract(chainId, contractAddress, signer), [chainId, contractAddress, signer]);
};
export const useLockupStaking = (chainId: ChainId, contractAddress: string) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getLockupStakingContract(chainId, contractAddress, signer), [chainId, contractAddress, signer]);
};

export const useIndexContract = (chainId: ChainId, contractAddress: string, version: string = "V1") => {
  const { data: signer } = useWalletClient();
  return useMemo(
    () => getIndexContract(chainId, contractAddress, version, signer),
    [chainId, contractAddress, version, signer]
  );
};

export const useOldIndexContract = (chainId: ChainId, contractAddress: string) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getOldIndexContract(chainId, contractAddress, signer), [chainId, contractAddress, signer]);
};

export const useFarmFactoryContract = (chainId: ChainId) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getFarmFactoryContract(chainId, signer), [chainId, signer]);
};

export const useIndexFactoryContract = (chainId: ChainId) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getIndexFactoryContract(chainId, signer), [chainId, signer]);
};

export const useFlaskNftContract = (chainId: ChainId) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getFlaskNftContract(chainId, signer), [chainId, signer]);
};

export const useMirrorNftContract = (chainId: ChainId) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getMirrorNftContract(chainId, signer), [chainId, signer]);
};

export const useNftStakingContract = (chainId: ChainId) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getNftStakingContract(chainId, signer), [chainId, signer]);
};

// Code below migrated from Exchange useContract.ts

// returns null on errors
export function useContract(address: string | undefined, abi: any) {
  const { chainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!address || !abi || !chainId) return null;
    try {
      return getContract(chainId, address, abi, walletClient);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, abi, chainId, walletClient]);
}

export function useTokenContract(tokenAddress?: string) {
  return useContract(tokenAddress, erc20ABI);
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId();
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, WETH_ABI);
}

export function useBrewlabsRouterContract(chainId: ChainId, address: string) {
  const { data: signer } = useWalletClient();
  return useMemo(() => getBrewlabsRouterContract(chainId, address, signer), [chainId, address, signer]);
}

export function useENSRegistrarContract() {
  const { chainId } = useActiveChainId();
  let address: string | undefined;
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.BSC_MAINNET:
      case ChainId.BSC_TESTNET:
      case ChainId.ETHEREUM:
        address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        break;
    }
  }
  return useContract(address, ENS_ABI);
}

export function useENSResolverContract(address: string | undefined) {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI);
}

export const useSIDContract = (chainId, address) => {
  return useMemo(() => getSidContract(chainId, address), [address, chainId]);
};

export const useUNSContract = (chainId, address) => {
  return useMemo(() => getUnsContract(chainId, address), [chainId, address]);
};

export function useBytes32TokenContract(tokenAddress?: string) {
  return useContract(tokenAddress, ERC20_BYTES32_ABI);
}

export function usePairContract(pairAddress?: string) {
  return useContract(pairAddress, LpTokenAbi);
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId();
  return useContract(getMulticallAddress(chainId), multiCallAbi);
}

export function useTokenTransferContract() {
  const { chainId } = useActiveChainId();
  return useContract(getTokenTransferAddress(chainId), ConstructorABI);
}

export const useBrewlabsFeeManager = (chainId: ChainId) => {
  const { data: signer } = useWalletClient();
  return useMemo(() => getBrewlabsFeeManagerContract(chainId, signer), [chainId, signer]);
};
export function useExternalMasterchef(chef = Chef.MASTERCHEF) {
  const [appId] = useAppId();
  return useContract(getExternalMasterChefAddress(appId, chef), ExternalMasterChefABI);
}

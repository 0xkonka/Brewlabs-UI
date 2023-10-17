import { ChainId } from "@brewlabs/sdk";
import { brewsToken } from "config/constants/tokens";
import { AppId, Chef } from "config/constants/types";

// ABI
import erc721Abi from "config/abi/erc721";
import aggregatorAbi from "config/abi/swap/brewlabsAggregator";
import brewlabsRouterAbi from "config/abi/swap/brewlabsRouter";
import brewlabsFeeManagerAbi from "config/abi/swap/brewlabsFeeManager";
import brewlabsAggregationRouterAbi from "config/abi/swap/BrewlabsAggregationRouter";
import verifictionAbi from "config/abi/brewlabsFactoryVerification";
import lockupStaking from "config/abi/staking/brewlabsLockup";
import lpManagerAbi from "config/abi/brewlabsLiquidityManager";
import lpManagerV2Abi from "config/abi/brewlabsLiquidityManagerV2";
import zapperAbi from "config/abi/brewlabsZapInConstructor";
import externalMasterChefAbi from "config/abi/externalMasterchef";
import masterChef from "config/abi/farm/masterchef";
import masterChefV2 from "config/abi/farm/masterchefV2";
import MultiCallAbi from "config/abi/Multicall";
import singleStaking from "config/abi/staking/singlestaking";
import claimableTokenAbi from "config/abi/claimableToken";
import dividendTrackerAbi from "config/abi/dividendTracker";
import IndexAbi from "config/abi/indexes";
import IndexImplAbi from "config/abi/indexes/indexImpl";
import IndexImplV2Abi from "config/abi/indexes/indexImpl_v2";
import IndexFactoryAbi from "config/abi/indexes/factory";
import FarmImplAbi from "config/abi/farm/farmImpl";
import FarmFactoryAbi from "config/abi/farm/factory";
import FlaskNftAbi from "config/abi/nfts/flaskNft";
import MirrorNftAbi from "config/abi/nfts/mirrorNft";
import NftStakingAbi from "config/abi/nfts/nftStaking";

import SidAbi from "config/abi/ens/SID";
import SidResolverAbi from "config/abi/ens/SIDResolver";

// Addresses
import {
  getMulticallAddress,
  getLpManagerAddress,
  getLpManagerV2Address,
  getAggregatorAddress,
  getZapperAddress,
  getVerificationAddress,
  getPancakeMasterChefAddress,
  getExternalMasterChefAddress,
  getBrewlabsAggregationRouterAddress,
  getBrewlabsFeeManagerAddress,
  getFarmFactoryAddress,
  getIndexFactoryAddress,
  getFlaskNftAddress,
  getMirrorNftAddress,
  getNftStakingAddress,
} from "utils/addressHelpers";
import { WalletClient, PublicClient, getContract as viemGetContract } from "viem";
import { getViemClients } from "./viem";
import { erc20ABI } from "wagmi";

export const getContract = (
  chainId: ChainId,
  address: string,
  abi: any,
  signer?: WalletClient,
  publicClient?: PublicClient
) => {
  const c = viemGetContract({
    abi,
    address: address as `0x${string}`,
    publicClient: publicClient ?? getViemClients({ chainId }),
    walletClient: signer,
  });
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  };
};
export const getBrewsTokenContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, brewsToken[chainId].address, erc20ABI, signer);
};

export const getClaimableTokenContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, claimableTokenAbi, signer);
};

export const getDividendTrackerContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, dividendTrackerAbi, signer);
};

export const getBep20Contract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, erc20ABI, signer);
};
export const getErc721Contract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, erc721Abi, signer);
};
export const getSingleStakingContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, singleStaking, signer);
};
export const getLockupStakingContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, lockupStaking, signer);
};
export const getLpManagerContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getLpManagerAddress(chainId), lpManagerAbi, signer);
};
export const getLpManagerV2Contract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getLpManagerV2Address(chainId), lpManagerV2Abi, signer);
};
export const getMasterchefContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, masterChefV2, signer);
};
export const getEmergencyMasterchefContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, masterChef, signer);
};

export const getMulticallContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getMulticallAddress(chainId), MultiCallAbi, signer);
};

export const getAggregatorContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getAggregatorAddress(chainId), aggregatorAbi, signer);
};

export const getBrewlabsAggregationRouterContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getBrewlabsAggregationRouterAddress(chainId), brewlabsAggregationRouterAbi, signer);
};

export const getFarmFactoryContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getFarmFactoryAddress(chainId), FarmFactoryAbi, signer);
};

export const getFarmImplContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, FarmImplAbi, signer);
};

export const getIndexFactoryContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getIndexFactoryAddress(chainId), IndexFactoryAbi, signer);
};

export const getIndexContract = (chainId: ChainId, address: string, version: string, signer?: WalletClient) => {
  if (version > "V1") {
    return getContract(chainId, address, IndexImplV2Abi, signer);
  }

  return getContract(chainId, address, IndexImplAbi, signer);
};

export const getOldIndexContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, IndexAbi, signer);
};

export const getFlaskNftContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getFlaskNftAddress(chainId), FlaskNftAbi, signer);
};

export const getMirrorNftContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getMirrorNftAddress(chainId), MirrorNftAbi, signer);
};

export const getNftStakingContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getNftStakingAddress(chainId), NftStakingAbi, signer);
};

export const getBrewlabsRouterContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, brewlabsRouterAbi, signer);
};

export const getBrewlabsFeeManagerContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getBrewlabsFeeManagerAddress(chainId), brewlabsFeeManagerAbi, signer);
};

export const getZapInContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getZapperAddress(chainId), zapperAbi, signer);
};

export const getExternalMasterChefContract = (
  chainId: ChainId,
  appId: AppId,
  chef = Chef.MASTERCHEF,
  signer?: WalletClient
) => {
  return getContract(chainId, getExternalMasterChefAddress(appId, chef), externalMasterChefAbi, signer);
};

export const getVerificationContract = (chainId: ChainId, signer?: WalletClient) => {
  return getContract(chainId, getVerificationAddress(chainId), verifictionAbi, signer);
};

export const getPancakeMasterChefContract = (signer?: WalletClient) => {
  return getContract(ChainId.BSC_MAINNET, getPancakeMasterChefAddress(), masterChefV2, signer);
};

export const getSidContract = (chainId: number, address: string) => {
  return getContract(chainId, address, SidAbi);
};

export const getUnsContract = (chainId: ChainId, address: string) => {
  return getContract(chainId, address, [
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      name: "reverseNameOf",
      outputs: [
        {
          internalType: "string",
          name: "reverseUri",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const);
};

export const getSidResolverContract = (chainId: ChainId, address: string, signer?: WalletClient) => {
  return getContract(chainId, address, SidResolverAbi, signer);
};

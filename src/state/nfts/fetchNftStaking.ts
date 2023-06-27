import NftStakingAbi from "config/abi/nfts/nftStaking.json";
import { getNftStakingAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";

export const fetchNftStakingPublicData = async (chainId) => {
  const calls = ["performanceFee", "totalStaked", "oneTimeLimit"].map((method) => ({
    address: getNftStakingAddress(chainId),
    name: method,
  }));

  const result = await multicall(NftStakingAbi, calls, chainId);
  return {
    chainId,
    performanceFee: result[0][0].toString(),
    totalStaked: result[1][0].toNumber(),
    oneTimeLimit: result[2][0].toNumber(),
  };
};

export const fetchNftStakingUserData = async (chainId, account) => {
  if (!account) return { chainId, stakedInfo: { amount: 0, tokenIds: [] } };

  let result = await multicall(NftStakingAbi, [
    { address: getNftStakingAddress(chainId), name: "stakedInfo", params: [account] },
  ]);

  return {
    chainId,
    userData: { stakedAmount: result[0][0].toNumber(), stakedTokenIds: result[1].map((t) => t.toNumber()) },
  };
};

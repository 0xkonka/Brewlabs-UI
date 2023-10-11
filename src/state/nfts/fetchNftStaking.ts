import NftStakingAbi from "config/abi/nfts/nftStaking";
import { getNftStakingAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchNftStakingPublicData = async (chainId) => {
  const publicClient = getViemClients({ chainId });

  const calls = ["performanceFee", "totalStaked", "oneTimeLimit", "startBlock", "bonusEndBlock", "rewardPerBlock"].map(
    (method) => ({
      address: getNftStakingAddress(chainId) as `0x${string}`,
      abi: NftStakingAbi,
      functionName: method,
    })
  );

  const result = await publicClient.multicall({ contracts: calls });
  return {
    chainId,
    performanceFee: result[0].result.toString(),
    totalStaked: +result[1].result.toString(),
    oneTimeLimit: +result[2].result.toString(),
    startBlock: +result[3].result.toString(),
    bonusEndBlock: +result[4].result.toString(),
    rewardPerBlock: result[5].result.toString(),
  };
};

export const fetchNftStakingUserData = async (chainId, account) => {
  if (!account) return { chainId, stakedInfo: { amount: 0, tokenIds: [] } };

  const publicClient = getViemClients({ chainId });
  let result = await publicClient.multicall({
    contracts: [
      {
        address: getNftStakingAddress(chainId) as `0x${string}`,
        abi: NftStakingAbi,
        functionName: "stakedInfo",
        args: [account],
      },
      {
        address: getNftStakingAddress(chainId) as `0x${string}`,
        abi: NftStakingAbi,
        functionName: "pendingReward",
        args: [account],
      },
    ],
  });

  return {
    chainId,
    userData: {
      stakedAmount: +result[0].result[0].toString(),
      stakedTokenIds: result[0].result[1].map((t) => +t.toString()),
      earnings: result[1].result.toString(),
    },
  };
};

import MirrorNftAbi from "config/abi/nfts/mirrorNft";
import { getFlaskNftAddress, getMirrorNftAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchMirrorNftUserData = async (chainId, account) => {
  if (!account) return { chainId, userData: undefined };

  const client = getViemClients({ chainId });

  const res = await client.readContract({
    address: getMirrorNftAddress(chainId) as `0x${string}`,
    abi: MirrorNftAbi,
    functionName: "balanceOf",
    args: [account],
  });
  const balance = +res.toString();
  if (balance == 0) return { chainId, userData: { balances: [] } };

  let calls = [];
  for (let i = 0; i < balance; i++) {
    calls.push({
      address: getMirrorNftAddress(chainId) as `0x${string}`,
      abi: MirrorNftAbi,
      functionName: "tokenOfOwnerByIndex",
      args: [account, BigInt(i)],
    });
  }
  let result = await client.multicall({ contracts: calls });
  const tokenIds = result.map((tokenId) => tokenId.result);

  calls = tokenIds.map((tokenId) => ({
    address: getFlaskNftAddress(chainId) as `0x${string}`,
    abi: MirrorNftAbi,
    functionName: "rarityOf",
    args: [tokenId],
  }));
  result = await client.multicall({ contracts: calls });

  const balances = tokenIds.map((tokenId, index) => ({
    tokenId: +tokenId.toString(),
    rarity: +result[index].result.toString(),
  }));

  return { chainId, userData: { balances } };
};

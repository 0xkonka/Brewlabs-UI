import { erc20ABI } from "wagmi";
import FlaskNftAbi from "config/abi/nfts/flaskNft";
import { getFlaskNftAddress } from "utils/addressHelpers";
import { getViemClients } from "utils/viem";

export const fetchFlaskNftPublicData = async (chainId) => {
  const publicClient = getViemClients({ chainId });

  const calls = [
    "mintFee",
    "brewsMintFee",
    "upgradeFee",
    "brewsUpgradeFee",
    "oneTimeLimit",
    "maxSupply",
    "totalSupply",
  ].map((method) => ({
    address: getFlaskNftAddress(chainId) as `0x${string}`,
    abi: FlaskNftAbi,
    functionName: method,
  }));

  const result = await publicClient.multicall({ contracts: calls });
  return {
    chainId,
    mintFee: { brews: result[1].result.toString(), stable: result[0].result.toString() },
    upgradeFee: { brews: result[3].result.toString(), stable: result[2].result.toString() },
    oneTimeLimit: +result[4].result.toString(),
    maxSupply: +result[5].result.toString(),
    totalSupply: +result[6].result.toString(),
  };
};

export const fetchFlaskNftUserData = async (chainId, account, tokens) => {
  if (!account) return { chainId, userData: undefined };

  const publicClient = getViemClients({ chainId });
  const res = await publicClient.readContract({
    address: getFlaskNftAddress(chainId) as `0x${string}`,
    abi: FlaskNftAbi,
    functionName: "balanceOf",
    args: [account],
  });
  const balance = +res.toString();

  let calls = [];
  for (let i = 0; i < balance; i++) {
    calls.push({
      address: getFlaskNftAddress(chainId) as `0x${string}`,
      abi: FlaskNftAbi,
      functionName: "tokenOfOwnerByIndex",
      args: [account, BigInt(i)],
    });
  }
  let result = await publicClient.multicall({ contracts: calls });
  const tokenIds = result.map((tokenId) => tokenId.result);

  calls = tokenIds.map((tokenId) => ({
    address: getFlaskNftAddress(chainId) as `0x${string}`,
    abi: FlaskNftAbi,
    functionName: "rarityOf",
    args: [tokenId],
  }));
  result = await publicClient.multicall({ contracts: calls });

  const balances = tokenIds.map((tokenId, index) => ({
    tokenId: +tokenId.toString(),
    rarity: +result[index].result.toString(),
  }));

  const allowances = await publicClient.multicall({
    contracts: tokens.map((token) => ({
      address: token,
      abi: erc20ABI,
      functionName: "allowance",
      args: [account, getFlaskNftAddress(chainId) as `0x${string}`],
    })),
  });

  return { chainId, userData: { balances, allowances: allowances.map((allowance) => allowance.result.toString()) } };
};

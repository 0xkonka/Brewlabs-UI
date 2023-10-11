import { formatEther } from "viem";

import IndexAbi from "config/abi/indexes";
import IndexNftAbi from "config/abi/indexes/indexNft";
import DeployerNftAbi from "config/abi/indexes/deployerNft";

import { MULTICALL_FETCH_LIMIT } from "config/constants";
import { getViemClients } from "utils/viem";
import { BIG_ZERO } from "utils/bigNumber";

export const fetchUserStakings = async (account, chainId, indexes) => {
  const publicClient = getViemClients({ chainId });

  const selectedIndexs = indexes.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedIndexs.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedIndexs.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      if (batch.length === 0) return;

      try {
        let calls = [];
        for (let pool of batch) {
          calls.push({
            address: pool.address,
            abi: IndexAbi,
            functionName: "userInfo",
            args: [account],
          });
        }

        const userStakes: any = await publicClient.multicall({ contracts: calls });
        batch.forEach((pool, index) => {
          data.push({
            pid: pool.pid,
            stakedUsdAmount: formatEther(userStakes[index].result[1]),
            stakedBalances: userStakes[index].result[0].map((amount) => amount.toString()),
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );
  return data;
};

export const fetchUserNftAllowance = async (account, chainId, indexes) => {
  const publicClient = getViemClients({ chainId });

  const selectedIndexs = indexes.filter((p) => p.chainId === chainId);
  const filters = [];
  for (let i = 0; i < selectedIndexs.length; i += MULTICALL_FETCH_LIMIT) {
    const batch = selectedIndexs.slice(i, i + MULTICALL_FETCH_LIMIT);
    filters.push(batch);
  }

  const data = [];
  await Promise.all(
    filters.map(async (batch) => {
      if (batch.length === 0) return;

      try {
        let calls = [];
        for (let pool of batch) {
          calls.push({
            address: pool.category === undefined ? pool.nft : pool.indexNft,
            abi: IndexNftAbi,
            functionName: "isApprovedForAll",
            args: [account, pool.address],
          });
        }

        const allowances = await publicClient.multicall({ contracts: calls });

        batch.forEach((pool, index) => {
          data.push({
            pid: pool.pid,
            allowance: allowances[index].result,
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    })
  );
  return data;
};

export const fetchUserBalance = async (account, chainId) => {
  const publicClient = getViemClients({ chainId });
  if (!account || !publicClient) return BIG_ZERO;
// return BIG_ZERO
  const ethBalance = await publicClient.getBalance({address: account});
  return ethBalance;
};

export const fetchUserIndexNftData = async (account, chainId, nftAddr) => {
  if (!nftAddr) return [];

  const publicClient = getViemClients({ chainId });
  const balance = await publicClient.readContract({
    address: nftAddr,
    abi: IndexNftAbi,
    functionName: "balanceOf",
    args: [account],
  });

  if (balance == BIG_ZERO) return [];

  if (balance > BIG_ZERO) {
    let calls = [];
    for (let i = 0; i < +balance.toString(); i++) {
      calls.push({
        address: nftAddr,
        abi: IndexNftAbi,
        functionName: "tokenOfOwnerByIndex",
        args: [account, BigInt(i)],
      });
    }

    let tokenIds = [];
    const result = await publicClient.multicall({ contracts: calls });
    for (let i = 0; i < +balance.toString(); i++) {
      tokenIds.push(+result[i].result.toString());
    }

    calls = tokenIds.map((tokenId) => ({
      address: nftAddr,
      abi: IndexNftAbi,
      functionName: "getNftInfo",
      args: [BigInt(tokenId)],
    }));
    const nftInfo = await publicClient.multicall({ contracts: calls });

    return tokenIds.map((tokenId, index) => {
      let level = +nftInfo[index].result[0].toString();
      let usdAmount = formatEther(nftInfo[index].result[2]);
      let amounts = nftInfo[index].result[1].map((amount) => amount.toString());
      return {
        tokenId,
        level,
        amounts,
        usdAmount,
        indexAddress: nftInfo[index].result[3] ?? "0x11ff513ED9770C2eB02655777EF55F123a17ec00",
      };
    });
  }
};

export const fetchUserDeployerNftData = async (account, chainId, nftAddr) => {
  if (!nftAddr) return [];

  const publicClient = getViemClients({ chainId });
  const balance = await publicClient.readContract({
    address: nftAddr,
    abi: DeployerNftAbi,
    functionName: "balanceOf",
    args: [account],
  });
  if (balance == BIG_ZERO) return [];

  if (balance > BIG_ZERO) {
    let calls = [];
    for (let i = 0; i < +balance.toString(); i++) {
      calls.push({
        address: nftAddr,
        abi: DeployerNftAbi,
        functionName: "tokenOfOwnerByIndex",
        params: [account, BigInt(i)],
      });
    }

    let tokenIds = [];
    const result = await publicClient.multicall({ contracts: calls });
    for (let i = 0; i < +balance.toString(); i++) {
      tokenIds.push(+result[i].result.toString());
    }

    calls = tokenIds.map((tokenId) => ({
      address: nftAddr,
      abi: DeployerNftAbi,
      functionName: "getIndexInfo",
      params: [BigInt(tokenId)],
    }));
    const indexInfo = await publicClient.multicall({ contracts: calls });

    return tokenIds.map((tokenId, index) => {
      let usdAmount = formatEther(indexInfo[index].result[2]);
      let amounts = indexInfo[index].result[3].map((amount) => amount.toString());
      return {
        tokenId,
        amounts,
        usdAmount,
        indexAddress: indexInfo[index].result[0],
      };
    });
  }
};

/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { erc20ABI } from "wagmi";

import { getBep20Contract } from "utils/contractHelpers";
import { getViemClients } from "utils/viem";

export async function getMultiChainTotalBalances(tokens: any, address: any) {
  let totalBalance = 0;
  const balances = await Promise.all(
    tokens.map(async (data) => {
      try {
        const tokenContract = getBep20Contract(data.chainId, data.address);
        const balance = await tokenContract.read.balanceOf([address]);
        return { ...data, balance };
      } catch (e) {
        return { ...data, balance: BigInt(0) };
      }
    })
  );
  for (let i = 0; i < balances.length; i++) totalBalance += +formatUnits(balances[i].balance, balances[i].decimals);
  return totalBalance;
}

export const useTotalUserBalance = (tokens: any, address: any) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const tokenStringified = JSON.stringify(tokens);
  useEffect(() => {
    if (!address) return;
    getMultiChainTotalBalances(tokens, address)
      .then((data) => setTotalBalance(data))
      .catch((e) => console.log(e));
  }, [address, tokenStringified]);
  return totalBalance;
};

export async function getBalances(tokens: any, addresses: any) {
  let balances = new Object();
  let totalBalance = 0;
  await Promise.all(
    Object.keys(tokens).map(async (key: any, i) => {
      try {
        if (!tokens[key][i].decimals) return null;
        const client = getViemClients({ chainId: tokens[key][i].chainId });
        const calls = addresses[key].map((address, i) => {
          return {
            abi: erc20ABI,
            address: tokens[key][i].address,
            functionName: "balanceOf",
            args: [address],
          };
        });
        const result = await client.multicall({ contracts: calls });
        const tokenDatas = result.map((data, i) => {
          const balance = formatUnits(data.result as bigint, tokens[key][i].decimals);
          totalBalance += +balance;
          return { ...tokens[key][i], balance, account: addresses[key][i] };
        });
        balances[key] = tokenDatas;
      } catch (e) {
        // console.log(e);
      }
    })
  );
  return { balances, totalBalance };
}

const useTokenBalances = (tokens: any, addresses: any) => {
  const [balances, setBalances] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);

  const strigifiedTokens = JSON.stringify(tokens);
  const strigifiedAddresses = JSON.stringify(addresses);

  useEffect(() => {
    getBalances(tokens, addresses)
      .then((result) => {
        setTotalBalance(result.totalBalance);
        setBalances(result.balances);
      })
      .catch((e) => console.log(e));
  }, [strigifiedTokens, strigifiedAddresses]);

  return { balances, totalBalance };
};

export default useTokenBalances;

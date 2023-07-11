/* eslint-disable react-hooks/rules-of-hooks */
import { ChainId } from "@brewlabs/sdk";
import { ERC20_ABI } from "config/abi/erc20";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import multicall from "utils/multicall";
import { simpleRpcProvider } from "utils/providers";

export async function getMultiChainTotalBalances(tokens: any, address: any) {
  let totalBalance = 0;
  const balances = await Promise.all(
    tokens.map(async (data) => {
      try {
        const provider = simpleRpcProvider(data.chainId);
        const tokenContract = new Contract(data.address, ERC20_ABI, provider);
        const balance = await tokenContract.balanceOf(address);
        return { ...data, balance };
      } catch (e) {
        return { ...data, balance: 0 };
      }
    })
  );
  for (let i = 0; i < balances.length; i++) totalBalance += balances[i].balance / Math.pow(10, balances[i].decimals);
  return totalBalance;
}

export async function getTreasuryBalances(tokens: any, addresses: any) {
  let totalBalance = 0;
  const balances = await Promise.all(
    tokens.map(async (token) => {
      try {
        const calls = addresses[token.chainId].map((address) => {
          return {
            name: "balanceOf",
            params: [address],
            address: token.address,
          };
        });
        const balances = await multicall(ERC20_ABI, calls, token.chainId);
        let balance = 0;
        for (let i = 0; i < balances.length; i++) balance += balances[i][0] / Math.pow(10, token.decimals);
        return { ...token, balance };
      } catch (e) {
        console.log(e);
        return { ...token, balance: 0 };
      }
    })
  );
  for (let i = 0; i < balances.length; i++) totalBalance += balances[i].balance;
  return totalBalance;
}

const useTokenBalances = (tokens: any, addresses: any) => {
  const [balances, setBalances] = useState(null);
  async function fetchBalances() {
    let balances = new Object();
    await Promise.all(
      Object.keys(tokens).map(async (key, i) => {
        try {
          const calls = addresses[key].map((address, i) => {
            return {
              name: "balanceOf",
              params: [address],
              address: tokens[key][i].address,
            };
          });

          const result = await multicall(ERC20_ABI, calls, tokens[key].chainId);
          const tokenDatas = result.map((data, i) => {
            return { ...tokens[key][i], balance: data / Math.pow(10, tokens[key][i].decimals) };
          });
          balances[key] = tokenDatas;
        } catch (e) {
          console.log(e);
          return { ...tokens[key], balance: 0 };
        }
      })
    );

    setBalances(balances);
  }
  const strigifiedTokens = JSON.stringify(tokens);
  const strigifiedAddresses = JSON.stringify(addresses);
  useEffect(() => {
    fetchBalances();
  }, [strigifiedTokens, strigifiedAddresses]);
  return balances;
};

export default useTokenBalances;

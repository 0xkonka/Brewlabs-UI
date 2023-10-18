import { ChainId } from "@brewlabs/sdk";
import { Address, Hex, hexToString, parseAbi, PublicClient, WalletClient, zeroAddress } from "viem";

import { BridgeToken } from "config/constants/types";
import { getViemClients } from "utils/viem";
import { getMediatorAddress } from "./helpers";
import { BIG_ZERO } from "utils/bigNumber";
import { getContract } from "utils/contractHelpers";

export const fetchAllowance = async ({ mediator, address }: BridgeToken, account: string, client: PublicClient) => {
  if (!account || !address || address === zeroAddress || !mediator || mediator === zeroAddress || !client) {
    return BigInt(0);
  }

  try {
    const abi = parseAbi(["function allowance(address, address) view returns (uint256)"]);
    return await client.readContract({
      address: address as `0x${string}`,
      abi,
      functionName: "allowance",
      args: [account as `0x${string}`, mediator as `0x${string}`],
    });
  } catch (allowanceError) {
    console.error({ allowanceError });
  }
  return BigInt(0);
};

const fetchMode = async (bridgeDirectionId: number, token: BridgeToken) => {
  const client = getViemClients({ chainId: token.chainId });

  const mediatorAddress = getMediatorAddress(bridgeDirectionId, token.chainId);
  const abi = parseAbi(["function nativeTokenAddress(address) view returns (address)"]);
  const nativeTokenAddress = await client.readContract({
    address: mediatorAddress as `0x${string}`,
    abi,
    functionName: "nativeTokenAddress",
    args: [token.address as `0x${string}`],
  });
  if (nativeTokenAddress === zeroAddress) return "erc20";
  return "erc677";
};

export const fetchTokenName = async (token: { chainId: ChainId; name?: string; address: Address } | BridgeToken) => {
  const client = getViemClients({ chainId: token.chainId });

  let tokenName: any = token.name || "";
  try {
    const abi = parseAbi(["function name() view returns (string)"]);
    const tokenContract = getContract(token.chainId, token.address ?? zeroAddress, abi);
    tokenName = await tokenContract.read.name([]);
  } catch {
    const bytes32Abi = parseAbi(["function name() view returns (bytes32)"]);
    const tokenContract = getContract(token.chainId, token.address ?? zeroAddress, bytes32Abi);
    tokenName = hexToString((await tokenContract.read.name([])).toString() as `0x${string}`);
  }
  return tokenName as string;
};

const fetchTokenDetailsBytes32 = async (token: BridgeToken) => {
  const client = getViemClients({ chainId: token.chainId });
  const abi = parseAbi([
    "function decimals() view returns (uint8)",
    "function symbol() view returns (bytes32)",
    "function name() view returns (bytes32)",
  ]);

  const [{ result: name }, { result: symbol }, { result: decimals }] = await client.multicall({
    contracts: [
      { abi, address: (token.address ?? zeroAddress) as `0x${string}`, functionName: "name" },
      { abi, address: (token.address ?? zeroAddress) as `0x${string}`, functionName: "symbol" },
      { abi, address: (token.address ?? zeroAddress) as `0x${string}`, functionName: "decimals" },
    ],
  });

  return {
    name: hexToString(name),
    symbol: hexToString(symbol),
    decimals: Number(decimals),
  };
};

const fetchTokenDetailsString = async (token: BridgeToken) => {
  const client = getViemClients({ chainId: token.chainId });
  const abi = parseAbi([
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
  ]);

  const [{ result: name }, { result: symbol }, { result: decimals }] = await client.multicall({
    contracts: [
      { abi, address: (token.address ?? zeroAddress) as `0x${string}`, functionName: "name" },
      { abi, address: (token.address ?? zeroAddress) as `0x${string}`, functionName: "symbol" },
      { abi, address: (token.address ?? zeroAddress) as `0x${string}`, functionName: "decimals" },
    ],
  });

  return { name, symbol, decimals: Number(decimals) };
};

const fetchTokenDetailsFromContract = async (token: BridgeToken) => {
  let details = {};
  try {
    details = await fetchTokenDetailsString(token);
  } catch {
    details = await fetchTokenDetailsBytes32(token);
  }
  return details;
};

export const fetchTokenDetails = async (bridgeDirectionId: number, token: BridgeToken) => {
  const mediatorAddress = getMediatorAddress(bridgeDirectionId, token.chainId);
  const [{ name, symbol, decimals }, mode]: any = await Promise.all([
    fetchTokenDetailsFromContract(token),
    fetchMode(bridgeDirectionId, token),
  ]);

  // replace xDai in token names with GC

  return {
    ...token,
    name: name,
    symbol,
    decimals: Number(decimals),
    mode,
    mediator: mediatorAddress,
  };
};

export const approveToken = async (walletClient: WalletClient, { address, mediator }: BridgeToken, amount: bigint) => {
  const abi = parseAbi(["function approve(address, uint256)"]);

  return await walletClient.writeContract({
    address: address as `0x${string}`,
    abi,
    functionName: "approve",
    args: [mediator as `0x${string}`, amount],
    account: walletClient.account,
    chain: walletClient.chain,
  });
};

export const fetchTokenBalance = async (token: BridgeToken, account: string) => {
  const client = getViemClients({ chainId: token.chainId });
  return fetchTokenBalanceWithProvider(client, token, account);
};

export const fetchTokenBalanceWithProvider = async (
  client: PublicClient,
  { address, mode, symbol }: BridgeToken,
  account: string
) => {
  if (!account || !address || address === zeroAddress || !client) {
    return BIG_ZERO;
  }

  if (address === zeroAddress && mode === "NATIVE") {
    return client.getBalance({ address: account as `0x${string}` });
  }
  try {
    const abi = parseAbi(["function balanceOf(address) view returns (uint256)"]);
    const balance = await client.readContract({
      address: address as `0x${string}`,
      abi,
      functionName: "balanceOf",
      args: [account as `0x${string}`],
    });

    return balance;
  } catch (error) {
    console.error(`Error fetching balance for ${address}-${symbol}`, error);
  }

  return BigInt(0);
};

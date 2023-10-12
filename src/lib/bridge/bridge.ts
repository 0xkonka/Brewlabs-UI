import { ChainId } from "@brewlabs/sdk";
import { WalletClient, parseAbi, zeroAddress } from "viem";

import { BridgeToken, Version } from "config/constants/types";
import { bridgeConfigs } from "config/constants/bridge";
import { getViemClients } from "utils/viem";

import { getMediatorAddress, getNetworkLabel } from "./helpers";
import { fetchTokenName } from "./token";

const getToName = async (fromToken: BridgeToken, toChainId: ChainId, toAddress: string) => {
  const { name } = fromToken;
  if (toAddress === zeroAddress) {
    const fromName = name || (await fetchTokenName(fromToken));
    return `${fromName} on ${+toChainId === 100 ? "GC" : getNetworkLabel(toChainId)}`;
  }
  return fetchTokenName({ chainId: toChainId, address: toAddress });
};

const fetchToTokenDetails = async (bridgeDirectionId: number, fromToken: BridgeToken, toChainId: ChainId) => {
  const { chainId: fromChainId, address: fromAddress } = fromToken;

  const fromMediatorAddress = getMediatorAddress(bridgeDirectionId, fromChainId);
  const toMediatorAddress = getMediatorAddress(bridgeDirectionId, toChainId);

  const abi = parseAbi([
    "function isRegisteredAsNativeToken(address) view returns (bool)",
    "function bridgedTokenAddress(address) view returns (address)",
    "function nativeTokenAddress(address) view returns (address)",
  ]);

  const fromPublicClient = getViemClients({ chainId: fromChainId });
  const isNativeToken = await fromPublicClient.readContract({
    address: fromMediatorAddress as `0x${string}`,
    abi,
    functionName: "isRegisteredAsNativeToken",
    args: [fromAddress as `0x${string}`],
  });

  if (isNativeToken) {
    const toPublicClient = getViemClients({ chainId: toChainId });
    const toAddress = await toPublicClient.readContract({
      address: toMediatorAddress as `0x${string}`,
      abi,
      functionName: "bridgedTokenAddress",
      args: [fromAddress as `0x${string}`],
    });

    const toName = await getToName(fromToken, toChainId, toAddress);
    return {
      name: toName,
      chainId: toChainId,
      address: toAddress,
      mode: "erc677",
      mediator: toMediatorAddress,
    };
  }

  const toAddress = await fromPublicClient.readContract({
    address: fromMediatorAddress as `0x${string}`,
    abi,
    functionName: "nativeTokenAddress",
    args: [fromAddress as `0x${string}`],
  });

  const toName = await getToName(fromToken, toChainId, toAddress);
  return {
    name: toName,
    chainId: toChainId,
    address: toAddress,
    mode: "erc20",
    mediator: toMediatorAddress,
  };
};

export const fetchToToken = async (bridgeDirectionId: number, fromToken: BridgeToken, toChainId: ChainId) => {
  const toToken = await fetchToTokenDetails(bridgeDirectionId, fromToken, toChainId);
  return toToken;
};

export const fetchToAmount = async (
  bridgeDirectionId: number,
  feeType: string,
  fromToken: any,
  toToken: any,
  fromAmount: bigint,
  feeManagerAddress: string
) => {
  if (fromAmount <= 0 || !fromToken || !toToken) return BigInt(0);
  const { version, homeChainId, homeMediatorAddress } =
    bridgeConfigs.find((bridge) => bridge.bridgeDirectionId === bridgeDirectionId) ?? bridgeConfigs[0];

  const isHome = homeChainId === toToken.chainId;
  const tokenAddress = isHome ? toToken.address : fromToken.address;
  const mediatorAddress = isHome ? toToken.mediator : fromToken.mediator;
  if (mediatorAddress !== homeMediatorAddress || !tokenAddress || !feeManagerAddress) {
    return fromAmount;
  }

  try {
    const client = getViemClients({ chainId: version ? fromToken.chainId : homeChainId });
    const abi = parseAbi(["function calculateFee(bytes32, address, uint256) view returns (uint256)"]);
    const fee = await client.readContract({
      address: feeManagerAddress as `0x${string}`,
      abi,
      functionName: "calculateFee",
      args: [feeType as `0x${string}`, tokenAddress as `0x${string}`, fromAmount],
    });

    return fromAmount - fee;
  } catch (amountError) {
    console.error({ amountError });
    return fromAmount;
  }
};

const getDefaultTokenLimits = async (fromToken: BridgeToken, toToken: BridgeToken, abi: any) => {
  const decimals = fromToken.decimals;
  const fromMediatorAddress = fromToken.mediator ?? zeroAddress;
  const toMediatorAddress = toToken.mediator ?? zeroAddress;

  const fromClient = getViemClients({ chainId: fromToken.chainId });
  const toClient = getViemClients({ chainId: toToken.chainId });
  let [minPerTx, maxPerTx, dailyLimit]: any[] = await Promise.all([
    fromClient.readContract({
      address: fromMediatorAddress as `0x${string}`,
      abi,
      functionName: "minPerTx",
      args: [zeroAddress],
    }),
    toClient.readContract({
      address: toMediatorAddress as `0x${string}`,
      abi,
      functionName: "executionMaxPerTx",
      args: [zeroAddress],
    }),
    fromClient.readContract({
      address: fromMediatorAddress as `0x${string}`,
      abi,
      functionName: "executionDailyLimit",
      args: [zeroAddress],
    }),
  ]);

  if (decimals < 18) {
    const factor = BigInt(10 ** (18 - decimals));

    minPerTx = minPerTx / factor;
    maxPerTx = maxPerTx / factor;
    dailyLimit = dailyLimit / factor;

    if (minPerTx === 0) {
      minPerTx = BigInt(1);
      if (maxPerTx <= minPerTx) {
        maxPerTx = BigInt(100);
        if (dailyLimit <= maxPerTx) {
          dailyLimit = BigInt(10000);
        }
      }
    }
  } else {
    const factor = BigInt(10 ** (decimals - 18));

    minPerTx = minPerTx * factor;
    maxPerTx = maxPerTx * factor;
    dailyLimit = dailyLimit * factor;
  }

  return {
    minPerTx,
    maxPerTx,
    remainingLimit: dailyLimit,
    dailyLimit,
  };
};

export const fetchTokenLimits = async (
  bridgeDirectionId: number,
  fromToken: BridgeToken,
  toToken: BridgeToken,
  currentDay: number
) => {
  const isDedicatedMediatorToken = fromToken.mediator !== getMediatorAddress(bridgeDirectionId, fromToken.chainId);

  const abi = isDedicatedMediatorToken
    ? parseAbi([
        "function getCurrentDay() view returns (uint256)",
        "function minPerTx() view returns (uint256)",
        "function executionMaxPerTx() view returns (uint256)",
        "function dailyLimit() view returns (uint256)",
        "function totalSpentPerDay(uint256) view returns (uint256)",
        "function executionDailyLimit() view returns (uint256)",
        "function totalExecutedPerDay(uint256) view returns (uint256)",
      ])
    : parseAbi([
        "function getCurrentDay() view returns (uint256)",
        "function minPerTx(address) view returns (uint256)",
        "function executionMaxPerTx(address) view returns (uint256)",
        "function dailyLimit(address) view returns (uint256)",
        "function totalSpentPerDay(address, uint256) view returns (uint256)",
        "function executionDailyLimit(address) view returns (uint256)",
        "function totalExecutedPerDay(address, uint256) view returns (uint256)",
      ]);

  try {
    const fromClient = getViemClients({ chainId: fromToken.chainId });
    const toClient = getViemClients({ chainId: toToken.chainId });

    const fromTokenAddress = fromToken.address;
    const toTokenAddress = toToken.address;
    const fromMediatorAddress = fromToken.mediator ?? zeroAddress;
    const toMediatorAddress = toToken.mediator ?? zeroAddress;

    if (toTokenAddress === zeroAddress || fromTokenAddress === zeroAddress)
      return await getDefaultTokenLimits(fromToken, toToken, abi);

    const [minPerTx, dailyLimit, totalSpentPerDay, maxPerTx, executionDailyLimit, totalExecutedPerDay] =
      isDedicatedMediatorToken
        ? await Promise.all([
            ...(
              await fromClient.multicall({
                contracts: [
                  {
                    address: fromMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "minPerTx",
                  },
                  {
                    address: fromMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "dailyLimit",
                  },
                  {
                    address: fromMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "totalSpentPerDay",
                    args: [BigInt(currentDay)],
                  },
                ],
              })
            ).map((t) => t.result),
            ...(
              await toClient.multicall({
                contracts: [
                  {
                    address: toMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "executionMaxPerTx",
                  },
                  {
                    address: toMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "executionDailyLimit",
                  },
                  {
                    address: toMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "totalExecutedPerDay",
                    args: [BigInt(currentDay)],
                  },
                ],
              })
            ).map((t) => t.result),
          ])
        : await Promise.all([
            ...(
              await fromClient.multicall({
                contracts: [
                  {
                    address: fromMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "minPerTx",
                    args: [fromTokenAddress as `0x${string}`],
                  },
                  {
                    address: fromMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "dailyLimit",
                    args: [fromTokenAddress as `0x${string}`],
                  },
                  {
                    address: fromMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "totalSpentPerDay",
                    args: [fromTokenAddress as `0x${string}`, BigInt(currentDay)],
                  },
                ],
              })
            ).map((t) => t.result),
            ...(
              await toClient.multicall({
                contracts: [
                  {
                    address: toMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "executionMaxPerTx",
                    args: [toTokenAddress as `0x${string}`],
                  },
                  {
                    address: toMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "executionDailyLimit",
                    args: [toTokenAddress as `0x${string}`],
                  },
                  {
                    address: toMediatorAddress as `0x${string}`,
                    abi,
                    functionName: "totalExecutedPerDay",
                    args: [toTokenAddress as `0x${string}`, BigInt(currentDay)],
                  },
                ],
              })
            ).map((t) => t.result),
          ]);

    const remainingExecutionLimit = executionDailyLimit - totalExecutedPerDay;
    const remainingRequestLimit = dailyLimit - totalSpentPerDay;
    const remainingLimit =
      remainingRequestLimit < remainingExecutionLimit ? remainingRequestLimit : remainingExecutionLimit;

    return {
      minPerTx,
      maxPerTx,
      remainingLimit,
      dailyLimit: dailyLimit < executionDailyLimit ? dailyLimit : executionDailyLimit,
    };
  } catch (error) {
    console.error({ tokenLimitsError: error });
    return {
      minPerTx: BigInt(0),
      maxPerTx: BigInt(0),
      remainingLimit: BigInt(0),
      dailyLimit: BigInt(0),
    };
  }
};

export const relayTokens = async (
  walletClient: WalletClient,
  token: BridgeToken,
  receiver: string,
  amount: bigint,
  version?: Version,
  performanceFee?: string
) => {
  const { mode, mediator, address, helperContractAddress } = token;
  const mediatorAddress = (mediator ?? zeroAddress) as `0x${string}`;
  const client = getViemClients({ chainId: token.chainId });

  switch (mode) {
    case "NATIVE": {
      const abi = parseAbi(["function wrapAndRelayTokens(address _receiver) public payable"]);
      return walletClient.writeContract({
        address: (helperContractAddress ?? zeroAddress) as `0x${string}`,
        abi,
        functionName: "wrapAndRelayTokens",
        args: [receiver as `0x${string}`],
        value: performanceFee ? amount + BigInt(performanceFee) : amount,
        account: walletClient.account,
        chain: walletClient.chain,
      });
    }
    case "dedicated-erc20": {
      if (version) {
        const abi = parseAbi(["function relayTokens(address, uint256) public payable"]);
        const txData: any = {
          address: mediatorAddress,
          abi,
          functionName: "relayTokens",
          args: [receiver as `0x${string}`, amount],
          value: performanceFee,
          account: walletClient.account,
        };
        let gasLimit = await client.estimateContractGas(txData);
        gasLimit = (gasLimit * BigInt(1200)) / BigInt(1000);

        return walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      }

      if (performanceFee) {
        const abi = parseAbi([`function relayTokensWithFee(address, address, uint256) public payable`]);
        const txData: any = {
          address: mediatorAddress,
          abi,
          functionName: "relayTokensWithFee",
          args: [address as `0x${string}`, receiver as `0x${string}`, amount],
          value: performanceFee,
          account: walletClient.account,
        };
        let gasLimit = await client.estimateContractGas(txData);
        gasLimit = (gasLimit * BigInt(1200)) / BigInt(1000);

        return walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      }

      const abi = parseAbi(["function relayTokens(address, uint256) external"]);
      const txData: any = {
        address: mediatorAddress,
        abi,
        functionName: "relayTokens",
        args: [receiver as `0x${string}`, amount],
        account: walletClient.account,
      };
      let gasLimit = await client.estimateContractGas(txData);
      gasLimit = (gasLimit * BigInt(1200)) / BigInt(1000);
      return walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
    }
    case "erc20":
    default: {
      if (version) {
        const abi = parseAbi(["function relayTokens(address, address, uint256) public payable"]);
        const txData: any = {
          address: mediatorAddress,
          abi,
          functionName: "relayTokens",
          args: [address as `0x${string}`, receiver as `0x${string}`, amount],
          account: walletClient.account,
          value: performanceFee,
        };
        let gasLimit = await client.estimateContractGas(txData);
        gasLimit = (gasLimit * BigInt(1200)) / BigInt(1000);

        return walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      }

      if (performanceFee) {
        const abi = parseAbi(["function relayTokensWithFee(address, address, uint256) public payable"]);
        const txData: any = {
          address: mediatorAddress,
          abi,
          functionName: "relayTokensWithFee",
          args: [address as `0x${string}`, receiver as `0x${string}`, amount],
          value: performanceFee,
          account: walletClient.account,
        };
        let gasLimit = await client.estimateContractGas(txData);
        gasLimit = (gasLimit * BigInt(1200)) / BigInt(1000);

        return walletClient.writeContract({ ...txData, chain: walletClient.chain, gas: gasLimit });
      }

      const abi = parseAbi(["function relayTokens(address, address, uint256)"]);
      const txData: any = {
        address: mediatorAddress,
        abi,
        functionName: "relayTokens",
        args: [address as `0x${string}`, receiver as `0x${string}`, amount],
        account: walletClient.account,
      };
      let gas = await client.estimateContractGas(txData);
      gas = (gas * BigInt(1200)) / BigInt(1000);

      return walletClient.writeContract({ ...txData, chain: walletClient.chain, gas });
    }
  }
};

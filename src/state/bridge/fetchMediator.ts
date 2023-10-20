import { ChainId } from "@brewlabs/sdk";
import { getViemClients } from "utils/viem";
import { Address, parseAbi, zeroAddress } from "viem";
import { erc20ABI } from "wagmi";

export const fetchMediatorData = async (chainId: ChainId, address: Address, token: Address) => {
  const client = getViemClients({ chainId });

  const abi = parseAbi([
    "function getBridgeInterfacesVersion() external pure returns (uint64, uint64, uint64)",
    "function feeManager() external view returns (address)",
    "function isRegisteredAsNativeToken(address) external view returns (bool)",
    "function bridgedTokenAddress(address) external view returns (address)",
    "function nativeTokenAddress(address) external view returns (address)",

    "function FOREIGN_TO_HOME_FEE() view returns (bytes32)",
    "function HOME_TO_FOREIGN_FEE() view returns (bytes32)",

    "function getCurrentDay() view returns (uint256)",
    "function minPerTx(address) view returns (uint256)",
    "function maxPerTx(address) view returns (uint256)",
    "function executionMaxPerTx(address) view returns (uint256)",
    "function dailyLimit(address) view returns (uint256)",
    "function totalSpentPerDay(address, uint256) view returns (uint256)",
    "function executionDailyLimit(address) view returns (uint256)",
    "function totalExecutedPerDay(address, uint256) view returns (uint256)",
  ]);

  let results: any = await client.multicall({
    contracts: [
      { abi, address, functionName: "getBridgeInterfacesVersion" },
      { abi, address, functionName: "feeManager" },
      { abi, address, functionName: "getCurrentDay" },
      { abi, address, functionName: "isRegisteredAsNativeToken", args: [token] },
      { abi, address, functionName: "minPerTx", args: [token] },
      { abi, address, functionName: "maxPerTx", args: [token] },
      { abi, address, functionName: "executionMaxPerTx", args: [token] },
      { abi, address, functionName: "dailyLimit", args: [token] },
      { abi, address, functionName: "executionDailyLimit", args: [token] },
      { abi, address, functionName: "nativeTokenAddress", args: [token] },
    ],
  });
  if (results[0].error) return {};

  const version = results[0].result.join(".");
  const feeManager: Address = results[1].result;
  const currentDay = results[2].result;
  const isNative = results[3].result;
  const minPerTx = results[4].result.toString();
  const maxPerTx = results[5].result.toString();
  const executionMaxPerTx = results[6].result.toString();
  const dailyLimit = results[7].result.toString();
  const executionDailyLimit = results[8].result.toString();

  results = await client.multicall({
    contracts: [
      { abi, address, functionName: "totalSpentPerDay", args: [token, currentDay] },
      { abi, address, functionName: "totalExecutedPerDay", args: [token, currentDay] },
      {
        abi: parseAbi(["function rewardAddressList() external view returns (address[])"]),
        address: feeManager,
        functionName: "rewardAddressList",
      },
      {
        abi: parseAbi(["function FOREIGN_TO_HOME_FEE() view returns (bytes32)"]),
        address: feeManager,
        functionName: "FOREIGN_TO_HOME_FEE",
      },
      {
        abi: parseAbi(["function HOME_TO_FOREIGN_FEE() view returns (bytes32)"]),
        address: feeManager,
        functionName: "HOME_TO_FOREIGN_FEE",
      },
    ],
  });

  if (results[0].error)
    return {
      version,
      feeManager,
      isNative,
      minPerTx,
      maxPerTx,
      executionMaxPerTx,
      dailyLimit,
      executionDailyLimit,
      currentDay: Number(currentDay),
    };

  return {
    version,
    feeManager,
    isNative,
    minPerTx,
    maxPerTx,
    executionMaxPerTx,
    dailyLimit,
    executionDailyLimit,
    currentDay: Number(currentDay),
    totalSpentPerDay: results[0].result.toString(),
    totalExecutedPerDay: results[1].result.toString(),
    rewarderList: results[2].result,
    homeToForeignFeeType: results[3].result.toString(),
    foreignToHomeFeeType: results[4].result.toString(),
  };
};

export const fetchMediatorLimitData = async (chainId: ChainId, address: Address, token: Address) => {
  const client = getViemClients({ chainId });

  const abi = parseAbi([
    "function getCurrentDay() view returns (uint256)",
    "function minPerTx(address) view returns (uint256)",
    "function maxPerTx(address) view returns (uint256)",
    "function executionMaxPerTx(address) view returns (uint256)",
    "function dailyLimit(address) view returns (uint256)",
    "function totalSpentPerDay(address, uint256) view returns (uint256)",
    "function executionDailyLimit(address) view returns (uint256)",
    "function totalExecutedPerDay(address, uint256) view returns (uint256)",
  ]);

  const results = await client.multicall({
    contracts: [
      { abi, address, functionName: "getCurrentDay" },
      { abi, address, functionName: "minPerTx", args: [token] },
      { abi, address, functionName: "maxPerTx", args: [token] },
      { abi, address, functionName: "executionMaxPerTx", args: [token] },
      { abi, address, functionName: "dailyLimit", args: [token] },
      { abi, address, functionName: "executionDailyLimit", args: [token] },
    ],
  });

  const currentDay = results[0].result;
  const [{ result: totalSpentPerDay }, { result: totalExecutedPerDay }] = await client.multicall({
    contracts: [
      { abi, address, functionName: "totalSpentPerDay", args: [token, currentDay] },
      { abi, address, functionName: "totalExecutedPerDay", args: [token, currentDay] },
    ],
  });

  return {
    minPerTx: results[1].result.toString(),
    maxPerTx: results[2].result.toString(),
    executionMaxPerTx: results[3].result.toString(),
    dailyLimit: results[4].result.toString(),
    executionDailyLimit: results[5].result.toString(),
    currentDay: Number(currentDay),
    totalSpentPerDay: totalSpentPerDay.toString(),
    totalExecutedPerDay: totalExecutedPerDay.toString(),
  };
};

export const fetchBridgeUserData = async (chainId: ChainId, token: Address, account: Address, spender: Address) => {
  if (!chainId || !token || !account) return { balance: "0", allowance: "0" };

  const client = getViemClients({ chainId });

  const results = await client.multicall({
    contracts: [
      { abi: erc20ABI, address: token, functionName: "balanceOf", args: [account] },
      { abi: erc20ABI, address: token, functionName: "allowance", args: [account, spender] },
    ],
  });

  return { balance: results[0].result.toString(), allowance: results[1].result.toString() };
};

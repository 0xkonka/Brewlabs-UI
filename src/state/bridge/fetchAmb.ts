import { ChainId } from "@brewlabs/sdk";
import { getViemClients } from "utils/viem";
import { Address, parseAbi } from "viem";

export const fetchAmbData = async (chainId: ChainId, address: Address) => {
  const client = getViemClients({ chainId });
  const abi = parseAbi([
    "function getBridgeInterfacesVersion() external pure returns (uint64, uint64, uint64)",
    "function requiredBlockConfirmations() view returns (uint256)",
    "function requiredSignatures() public view returns (uint256)",
    "function validatorContract() public view returns (address)",
    "function validatorList() public view returns (address[])",
  ]);

  const results = await client.multicall({
    contracts: [
      { abi, address, functionName: "getBridgeInterfacesVersion" },
      { abi, address, functionName: "requiredBlockConfirmations" },
      { abi, address, functionName: "requiredSignatures" },
      { abi, address, functionName: "validatorContract" },
    ],
  });

  if (results[0].error) return {};

  const version = results[0].result.join(".");
  const requiredBlockConfirmations = results[1].result.toString();
  const requiredSignatures = results[2].result.toString();
  const validatorContract: Address = results[3].result;
  const validatorList = await client.readContract({ abi, address: validatorContract, functionName: "validatorList" });

  return {
    version,
    requiredBlockConfirmations,
    requiredSignatures,
    validatorContract,
    validatorList,
  };
};

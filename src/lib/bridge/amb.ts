import { PublicClient, WalletClient, parseAbi, toHex } from "viem";
import { NOT_ENOUGH_COLLECTED_SIGNATURES } from "./message";

export const TOKENS_CLAIMED = "Tokens already claimed";

export const fetchConfirmations = async (address: string, client: PublicClient) => {
  const abi = parseAbi(["function requiredBlockConfirmations() view returns (uint256)"]);
  const requiredConfirmations = await client.readContract({
    address: address as `0x${string}`,
    abi,
    functionName: "requiredBlockConfirmations",
  });
  return parseInt(requiredConfirmations.toString(), 10);
};

export const fetchAmbVersion = async (address: string, client: PublicClient) => {
  if (!client) {
    return "0.0.0";
  }

  const abi = parseAbi(["function getBridgeInterfacesVersion() external pure returns (uint64, uint64, uint64)"]);
  const ambVersion = await client.readContract({
    address: address as `0x${string}`,
    abi,
    functionName: "getBridgeInterfacesVersion",
  });
  return ambVersion.map((v: any) => v.toString()).join(".");
};

function strip0x(input: string) {
  return input.replace(/^0x/, "");
}

function signatureToVRS(rawSignature: string) {
  const signature = strip0x(rawSignature);
  const v = signature.substr(64 * 2);
  const r = signature.substr(0, 32 * 2);
  const s = signature.substr(32 * 2, 32 * 2);
  return { v, r, s };
}

function packSignatures(array: any[]): `0x${string}` {
  const length = strip0x(toHex(array.length));
  const msgLength = length.length === 1 ? `0${length}` : length;
  let v = "";
  let r = "";
  let s = "";
  array.forEach((e) => {
    v = v.concat(e.v);
    r = r.concat(e.r);
    s = s.concat(e.s);
  });
  return `0x${msgLength}${v}${r}${s}`;
}

const REVERT_ERROR_CODES = ["-32000", "-32016", "UNPREDICTABLE_GAS_LIMIT", "CALL_EXCEPTION"];

export const isRevertedError = (error: any) =>
  REVERT_ERROR_CODES.includes(error?.code && error?.code.toString()) ||
  REVERT_ERROR_CODES.includes(error?.error?.code && error?.error?.code.toString());

export const executeSignatures = async (
  walletClient: WalletClient,
  address: string,
  version: string,
  { messageData, signatures }: any
) => {
  if (!signatures || signatures.length === 0) {
    throw new Error(NOT_ENOUGH_COLLECTED_SIGNATURES);
  }

  const abi = parseAbi([
    "function executeSignatures(bytes messageData, bytes signatures) external",
    "function safeExecuteSignaturesWithAutoGasLimit(bytes _data, bytes _signatures) external",
  ]);
  
  try {
    const signs = packSignatures(signatures.map((s: any) => signatureToVRS(s)));
    console.log("signs", signs, messageData);

    const tx = await walletClient.writeContract({
      address: address as `0x${string}`,
      abi,
      functionName: version > "5.6.0" ? "safeExecuteSignaturesWithAutoGasLimit" : "executeSignatures",
      args: [messageData, signs],
      account: walletClient.account,
      chain: walletClient.chain,
    });
    return tx;
  } catch (error) {
    if (isRevertedError(error)) {
      throw new Error(TOKENS_CLAIMED);
    } else {
      throw error;
    }
  }
};

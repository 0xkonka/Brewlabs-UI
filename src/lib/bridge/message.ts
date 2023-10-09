import {
  PublicClient,
  decodeEventLog,
  encodeEventTopics,
  encodePacked,
  keccak256,
  parseAbi,
  recoverMessageAddress,
} from "viem";

export const NOT_ENOUGH_COLLECTED_SIGNATURES =
  "Transaction to the bridge is found but oracles’ confirmations are not collected yet. Wait for a minute and try again.";

export const getMessageData = async (isHome: boolean, client: PublicClient, txHash: `0x${string}`, txReceipt?: any) => {
  const abi = isHome
    ? parseAbi(["event UserRequestForSignature(bytes32 indexed messageId, bytes encodedData)"])
    : parseAbi(["event UserRequestForAffirmation(bytes32 indexed messageId, bytes encodedData)"]);
  let receipt = txReceipt;
  if (!receipt) {
    try {
      receipt = await client.getTransactionReceipt({ hash: txHash });
    } catch (error) {
      throw Error("Invalid hash.");
    }
  }
  if (!receipt || !receipt.logs) {
    throw Error("No transaction found.");
  }

  const eventTopic = encodeEventTopics({ abi, eventName: abi[0].name });
  const event = receipt.logs.find((e: any) => e.topics[0] === eventTopic);
  if (!event) {
    throw Error("It is not a bridge transaction. Specify hash of a transaction sending tokens to the bridge.");
  }
  const decodedLog = decodeEventLog({ abi, eventName: abi[0].name, topics: event.topics });

  return {
    messageId: decodedLog.args.messageId,
    messageData: decodedLog.args.encodedData,
  };
};

export const getMessage = async (isHome: boolean, client: PublicClient, ambAddress: string, txHash: string) => {
  const { messageId, messageData } = await getMessageData(isHome, client, txHash as `0x${string}`);
  const messageHash = keccak256(encodePacked(["bytes"], [messageData]));

  const abi = parseAbi([
    "function isAlreadyProcessed(uint256 _number) public pure returns (bool)",
    "function requiredSignatures() public view returns (uint256)",
    "function numMessagesSigned(bytes32 _message) public view returns (uint256)",
    "function signature(bytes32 _hash, uint256 _index) public view returns (bytes)",
  ]);

  const [requiredSignatures, numMessagesSigned] = await client.multicall({
    contracts: [
      { address: ambAddress as `0x${string}`, abi, functionName: "requiredSignatures" },
      {
        address: ambAddress as `0x${string}`,
        abi,
        functionName: "numMessagesSigned",
        args: [messageHash as `0x${string}`],
      },
    ],
  });

  const isAlreadyProcessed = await client.readContract({
    address: ambAddress as `0x${string}`,
    abi,
    functionName: "isAlreadyProcessed",
    args: [numMessagesSigned?.result],
  });

  if (!isAlreadyProcessed) {
    throw Error(NOT_ENOUGH_COLLECTED_SIGNATURES);
  }
  const signatures = await Promise.all(
    Array(requiredSignatures.result)
      .fill(null)
      .map((_item, index) =>
        client.readContract({
          address: ambAddress as `0x${string}`,
          abi,
          functionName: "signature",
          args: [messageHash as `0x${string}`, BigInt(index)],
        })
      )
  );

  const collectedSignatures = signatures.filter((s) => s !== "0x");
  return {
    messageData,
    signatures: collectedSignatures,
    messageId,
  };
};

export const messageCallStatus = async (ambAddress: string, client: PublicClient, messageId: string) => {
  const abi = parseAbi(["function messageCallStatus(bytes32 _messageId) public view returns (bool)"]);
  const claimed = await client.readContract({
    address: ambAddress as `0x${string}`,
    abi,
    functionName: "messageCallStatus",
    args: [messageId as `0x${string}`],
  });
  return claimed;
};

export const fetchRequiredSignatures = async (homeAmbAddress: string, client: PublicClient) => {
  const abi = parseAbi(["function requiredSignatures() public view returns (uint256)"]);
  const numRequired = await client.readContract({
    address: homeAmbAddress as `0x${string}`,
    abi,
    functionName: "requiredSignatures",
  });
  return numRequired;
};

export const fetchValidatorList = async (homeAmbAddress: string, client: PublicClient) => {
  let abi = parseAbi(["function validatorContract() public view returns (address)"]);
  const validatorContractAddress = await client.readContract({
    address: homeAmbAddress as `0x${string}`,
    abi,
    functionName: "validatorContract",
  });

  let abi_2 = parseAbi(["function validatorList() public view returns (address[])"]);
  const validatorList = await client.readContract({
    address: validatorContractAddress as `0x${string}`,
    abi: abi_2,
    functionName: "validatorList",
  });
  return validatorList;
};

export const getRemainingSignatures = async (
  messageData: any,
  signaturesCollected: any,
  requiredSignatures: number,
  validatorList: any[]
) => {
  const signatures = [];
  const remainingValidators = Object.fromEntries(validatorList.map((validator) => [validator, true]));
  for (let i = 0; i < signaturesCollected.length && signatures.length < requiredSignatures; i += 1) {
    const signer = await recoverMessageAddress({ message: messageData, signature: signaturesCollected[i] });
    if (validatorList.includes(signer)) {
      delete remainingValidators[signer];
      signatures.push(signaturesCollected[i]);
    }
  }
  if (signatures.length < requiredSignatures) {
    console.debug("On-chain collected signatures are not enough for message execution");
    const manualValidators = Object.keys(remainingValidators);
    const msgHash = keccak256(messageData);
    for (let i = 0; i < manualValidators.length && signatures.length < requiredSignatures; i += 1) {
      try {
        const overrideSignatures: any = {};
        if (overrideSignatures[msgHash]) {
          console.debug(`Adding manual signature from ${manualValidators[i]}`);
          signatures.push(overrideSignatures[msgHash]);
        } else {
          console.debug(`No manual signature from ${manualValidators[i]} was found`);
        }
      } catch (e) {
        console.error(`Signatures overrides are not present for ${manualValidators[i]}`);
      }
    }
  }
  if (signatures.length < requiredSignatures) {
    throw Error(NOT_ENOUGH_COLLECTED_SIGNATURES);
  }
  return signatures;
};

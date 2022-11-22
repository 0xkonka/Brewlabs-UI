import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { serializeTokens } from "./tokens";
import { BridgeDirectionConfig, Version } from "./types";

export const GRAPH_HEALTH_ENDPOINT = "https://api.thegraph.com/index-node/graphql";
export const POLLING_INTERVAL = 5000;

export const bridgeConfigs: BridgeDirectionConfig[] = [
  {
    bridgeDirectionId: 1,
    version: Version.V1,
    homeChainId: ChainId.ETHEREUM,
    foreignChainId: ChainId.BSC_MAINNET,
    homeToken: serializeTokens(ChainId.ETHEREUM).brews,
    foreignToken: serializeTokens(ChainId.BSC_MAINNET).brews,
    enableForeignCurrencyBridge: false,
    homeWrappedForeignCurrencyAddress: null,
    wrappedForeignCurrencyAddress: null,
    foreignMediatorAddress: "0x96Ac7259Ef7A43Eee7842d123a16bb3ed2f0BB04".toLowerCase(),
    homeMediatorAddress: "0xFe4b1c36Ffe8857DCc559710cd6cD42Cb4008C99".toLowerCase(),
    foreignAmbAddress: "0x588470CD8Db3f1cA914C1C5D913f5D8c6d904d9d".toLowerCase(),
    homeAmbAddress: "0x1903083125299b9B6024989B5E8936Be70Dc7c72".toLowerCase(),
    foreignGraphName: "brainstormk/brewlabs-bridge-bsc-mainnet",
    homeGraphName: "brainstormk/brewlabs-bridge-mainet-bsc",
    claimDisabled: false,
    tokensClaimDisabled: [],
    homePerformanceFee: ethers.utils.parseEther("0.005").toString(),
    foreignPerformanceFee: ethers.utils.parseEther("0.03").toString(),
  },
  {
    bridgeDirectionId: 10,
    version: Version.V1,
    homeChainId: ChainId.GOERLI,
    foreignChainId: ChainId.BSC_TESTNET,
    homeToken: serializeTokens(ChainId.GOERLI).test,
    foreignToken: serializeTokens(ChainId.BSC_TESTNET).test,
    enableForeignCurrencyBridge: false,
    homeWrappedForeignCurrencyAddress: null,
    wrappedForeignCurrencyAddress: null,
    foreignMediatorAddress: "0x086c50cbC5fc1223D9965165703f6cCe056eFDc2".toLowerCase(),
    homeMediatorAddress: "0x7b16C6EF21Cc1E0B85104e0336A75946491F0843".toLowerCase(),
    foreignAmbAddress: "0x070EF16ea0073ddb2a70a4Beb0131bDb60206A23".toLowerCase(),
    homeAmbAddress: "0x9C7D77031186d83449bb82d7152CE903c70Eb39c".toLowerCase(),
    foreignGraphName: "brainstormk/chapel-brewlabs-bridge",
    homeGraphName: "brainstormk/goerli-brewlabs-bridge",
    claimDisabled: false,
    tokensClaimDisabled: [],
    homePerformanceFee: ethers.utils.parseEther("0.00089").toString(),
    foreignPerformanceFee: ethers.utils.parseEther("0.00089").toString(),
  },
];

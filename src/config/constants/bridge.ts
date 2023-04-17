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
    foreignMediatorAddress: "0xaa72Dca573d31e1396ce4CB486b7d86b89DaBDE5".toLowerCase(),
    homeMediatorAddress: "0xe16f11B9a032656c25eCce1e24e3C6513c8767df".toLowerCase(),
    foreignAmbAddress: "0x588470CD8Db3f1cA914C1C5D913f5D8c6d904d9d".toLowerCase(),
    homeAmbAddress: "0x1903083125299b9B6024989B5E8936Be70Dc7c72".toLowerCase(),
    foreignGraphName: "brainstormk/brewlabs-bridge-bsc-mainnet",
    homeGraphName: "brainstormk/brewlabs-bridge-mainet-bsc",
    claimDisabled: false,
    tokensClaimDisabled: [],
    homePerformanceFee: ethers.utils.parseEther("0.01").toString(),
    foreignPerformanceFee: ethers.utils.parseEther("0.04").toString(),
  },
  {
    bridgeDirectionId: 2,
    version: Version.V1,
    homeChainId: ChainId.POLYGON,
    foreignChainId: ChainId.BSC_MAINNET,
    homeToken: serializeTokens(ChainId.POLYGON).usdt,
    foreignToken: serializeTokens(ChainId.BSC_MAINNET).brews,
    foreignMediatorAddress: "0xA6Ee307792854Ab1F753fCF0D14cb5912315fFB0".toLowerCase(),
    homeMediatorAddress: "0x04F740d74C8FEaB2df85C3cab74670F3E1dCb463".toLowerCase(),
    foreignAmbAddress: "0x691530aa59ca560F56A0b9d341183cEe2c3b6cA8".toLowerCase(),
    homeAmbAddress: "0xa7d50CE19c4558Cbbf382Dd342b8323ceC5A1bce".toLowerCase(),
    foreignGraphName: "brainstormk/brewlabs-bridge-bsc-polygon",
    homeGraphName: "brainstormk/brewlabs-bridge-polygon-bsc",
    claimDisabled: false,
    tokensClaimDisabled: [],
    homePerformanceFee: ethers.utils.parseEther("1.5").toString(),
    foreignPerformanceFee: ethers.utils.parseEther("0.04").toString(),
  },
];

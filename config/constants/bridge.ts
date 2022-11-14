import { serializeTokens } from "./tokens";
import { BridgeDirectionConfig } from "./types";

export const bridgeConfig: BridgeDirectionConfig[] = [{
  homeChainId: 5,
  foreignChainId: 97,
  homeToken: serializeTokens(5).test,
  foreignToken: serializeTokens(97).test,
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
}];

import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { ARBITRUM } = ChainId;
const tokens = {
  eth: NATIVE_CURRENCIES[ChainId.ARBITRUM],
  usdt: new Token(ChainId.ARBITRUM, "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", 6, "USDT", "Tether USD"),
};

export default tokens;

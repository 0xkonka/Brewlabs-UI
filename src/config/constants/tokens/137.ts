import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { POLYGON } = ChainId;
const tokens = {
  matic: NATIVE_CURRENCIES[ChainId.POLYGON],
  wmatic: WNATIVE[ChainId.POLYGON],
  usdc: new Token(
    POLYGON,
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    6,
    "USDC",
    "USD Coin (PoS)",
    "https://www.centre.io/"
  ),
  usdt: new Token(
    POLYGON,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    6,
    "USDT",
    "(PoS) Tether USD",
    "https://mapper.matic.today/"
  ),
  mtbc: new Token(
    POLYGON,
    "0xFC541ec44A41974d76FC0b2F526CAE781ffAbaED",
    18,
    "MTBC",
    "Metabolic",
    "https://metabolic.games/"
  ),
};

export default tokens;

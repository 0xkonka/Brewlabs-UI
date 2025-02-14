import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { BSC_TESTNET } = ChainId;
const tokens = {
  bnb: NATIVE_CURRENCIES[ChainId.BSC_TESTNET],
  wbnb: WNATIVE[ChainId.BSC_TESTNET],
  busd: new Token(
    BSC_TESTNET,
    "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
    18,
    "BUSD",
    "Binance USD",
    "https://www.paxos.com/busd/"
  ),
  usdt: new Token(BSC_TESTNET, "0x0fB5D7c73FA349A90392f873a4FA1eCf6a3d0a96", 18, "USDT", "Tether USD"),
  usdc: new Token(BSC_TESTNET, "0x64544969ed7EBf5f083679233325356EbE738930", 18, "USDC", "USDC Token"),
  test: new Token(BSC_TESTNET, "0x8428b19C97acCD93fA10f19cbbdfF4FB71C4D175", 18, "TEST", "TestToken"),
  tokenA: new Token(BSC_TESTNET, "0xC15BA1a077F6B2ecF51b8AAfbC31E04dC9CbC578", 18, "TOKENA", "TOKENA"),
  tokenB: new Token(BSC_TESTNET, "0x9C7C28A281B7F30796dC4d1831AF5FCB422a554A", 18, "TOKENB", "TOKENB"),
  tokenC: new Token(BSC_TESTNET, "0xB8Dc3ef9eB65A2d66ee4a133C836929c952c9D37", 18, "TOKENC", "TOKENC"),
  tokenD: new Token(BSC_TESTNET, "0x47111958274D902be3cd17634dd6886BF48F680d", 18, "TOKEN_D", "TOKEN_D"),
};

export default tokens;

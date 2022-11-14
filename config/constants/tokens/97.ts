import { ChainId, NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

const { BSC_TESTNET } = ChainId;
const tokens = {
  bnb: NATIVE_CURRENCIES[ChainId.BSC_TESTNET],
  wbnb: WNATIVE[ChainId.BSC_TESTNET],
  busd: new Token(
    BSC_TESTNET,
    "0x07D4c987AeB435F2729143F092212416e4ecc378",
    18,
    "BUSD",
    "Binance USD",
    "https://www.paxos.com/busd/"
  ),
  test: new Token(
    BSC_TESTNET,
    "0x8428b19C97acCD93fA10f19cbbdfF4FB71C4D175",
    18,
    "TEST",
    "TestToken"
  ),
};

export default tokens;

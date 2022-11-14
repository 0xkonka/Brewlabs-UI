import { ChainId } from "@brewlabs/sdk";
import { serializeTokens } from "../tokens";
import { SerializedFarmConfig, Version } from "../types";

export * from "./pancake";
export * from "./priceHelperLps"

const farms: SerializedFarmConfig[] = [
  /**
   * These 2 farms (PID 0, 1) should always be at the top of the file.
   */
  {
    pid: 0,
    farmId: 1,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BUSD-BNB LP",
    lpAddress: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
    contractAddress: "0x479EBabB0e8870188Aa1700489054Ec489a6AB28",
    token: serializeTokens(ChainId.BSC_MAINNET).busd,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).brews,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).busd,
  },
  {
    pid: 1,
    farmId: 1,
    poolId: 1,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BREWLABS-BNB LP",
    lpAddress: "0xc9cC6515a1df94AAed156F3bD6EFe86a100308fA",
    contractAddress: "0x479EBabB0e8870188Aa1700489054Ec489a6AB28",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).brews,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).brews,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).busd,
  },
  {
    pid: 2,
    farmId: 2,
    poolId: 1,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "MBC-BNB LP",
    lpAddress: "0x4cD6E8DD2E837999C12744C66bf86D819d932458",
    contractAddress: "0x964B99b97D89DCEAF707315E259b0941f2A9312a",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).mbc,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).mbc,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).busd,
    isServiceFee: true,
  },
  {
    pid: 3,
    farmId: 3,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "RARI-BNB LP",
    lpAddress: "0xFc36d2a80adF33f4562680e11cF4242E35c768C6",
    contractAddress: "0x927E38945CD644C12491F73d83DE98CCc63e33d8",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).rari,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).rari,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).bnb,
    isServiceFee: true,
    unverified: true,
  },
  {
    pid: 4,
    farmId: 4,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "SVT-BNB LP",
    lpAddress: "0x7A8455dD28EE9d99816FB615F12e675b30021DD5",
    contractAddress: "0xeD7D8ca398e7905eFa16206D9BB97E44F5B4f225",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).svt,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).svt,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).svt,
    isServiceFee: true,
  },
  {
    pid: 5,
    farmId: 5,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "SeTC-BNB LP",
    lpAddress: "0xA37D120132b8576Cd73167E7795716c05491d907",
    contractAddress: "0xBc46932E0A5C4dFd8b61fCb9A9Fa98B068Bbd507",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).setc,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).setc,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).bnb,
    isServiceFee: true,
  },
  {
    pid: 6,
    farmId: 6,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "KODI-BNB LP",
    lpAddress: "0x9419320957AC8bCcEdFeF7c1849F2a27cb6C67Bb",
    contractAddress: "0x944a609690e33B3785Ac8662Ae7D721e6c004e82",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).kodi,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).kodi,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).bnb,
    isServiceFee: true,
  },
  {
    pid: 9,
    farmId: 9,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "RIV2-BNB LP",
    lpAddress: "0x93Af64a8b64CdEf67912dd8Cc73A0Edc40b65F6f",
    contractAddress: "0x32020Ba42B6fFA2fB3868Ab516C89d3F6dae7e07",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).riv2,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).riv2,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).bnb,
    isServiceFee: true,
  },
  {
    pid: 10,
    farmId: 10,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "GVR-BNB LP",
    lpAddress: "0xb14173e6E9790C346aCfe9BC02b54AA81841427A",
    contractAddress: "0x9Ce67BDC5D19d795b93852079712214C21B792cd",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).gvr,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).gvr,
    isServiceFee: true,
  },
  {
    pid: 11,
    farmId: 11,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "EVRF-BNB LP",
    lpAddress: "0x9F5F87dF2fBF59F8bFC1022109591a2c8D3375f9",
    contractAddress: "0x742f82A5893CfE103fF0f4Fc5924d2d552225700",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).evrf,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).evrf,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).busd,
    isServiceFee: true,
    enableEmergencyWithdraw: true,
  },
  {
    pid: 13,
    farmId: 13,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "PLNT-BNB LP",
    lpAddress: "0x97406e22ffbE04676611a1D2ec8Ae04fB02f43EA",
    contractAddress: "0x46BB5E8708Fd86177C6F269396025Cb1e81aA062",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).plnt,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).plnt,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).busd,
    isServiceFee: true,
  },
  {
    pid: 14,
    farmId: 14,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    version: Version.V1,
    lpSymbol: "LYST-BNB LP",
    lpAddress: "0x16e27C5636faC160E6057D037e29BAEe6c1F5a94",
    contractAddress: "0xBC479334bb7c4227aBc30b6d996278d2CD5a5524",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).lyst,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).lyst,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).busd,
    isServiceFee: true,
  },
  {
    pid: 15,
    farmId: 15,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    version: Version.V2,
    lpSymbol: "MTX-BNB LP",
    lpAddress: "0xA4f906694368F27F0c794056a64aE646c75DfdF3",
    contractAddress: "0x73f15d1a630B6123Ed240F18D8797fd84A5Abc78",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).mtx,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).mtx,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).mtx,
    isServiceFee: true,
  },
  {
    pid: 16,
    farmId: 16,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    version: Version.V2,
    lpSymbol: "LOL-BNB LP",
    lpAddress: "0x4cEA027702723Ed7302b376A4c079AAA50445856",
    contractAddress: "0x6C94E2F169cB47A62d2b0889fF88814C265C1b7b",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).lol,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).lol,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).lol,
    isServiceFee: true,
  },
  {
    pid: 17,
    farmId: 17,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    version: Version.V2,
    lpSymbol: "EZ-BNB LP",
    lpAddress: "0x36dF890AAbC4106C0117329A6040fcc29D1E6016",
    contractAddress: "0xBD1918ae2A90299f3932C6231BFdcd8C5A36ad04",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).renteez,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).renteez,
    reflectionToken: serializeTokens(ChainId.BSC_MAINNET).renteez,
    isServiceFee: true,
  },
  {
    pid: 18,
    farmId: 18,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    version: Version.V2,
    lpSymbol: "VLK-BNB LP",
    lpAddress: "0x8659ec4FC20d878399a4AE1F1B25d5d24F95B0e0",
    contractAddress: "0x50C92CE8414634e0d2cB5A2F76bC0abDd85A9E3B",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).vlk,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).vlk,
    isServiceFee: true,
  },
  {
    pid: 19,
    farmId: 19,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "VIRAL-ETH LP",
    lpAddress: "0x2EFA525B14539EeA83ADCeE4E6578a35905fE8bc",
    contractAddress: "0x4276f22d2F1Af898CEf71988FF9cC06685297b29",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).viral,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).viral,
    reflectionToken: serializeTokens(ChainId.ETHEREUM).viralLP,
    compoundRelection: true,
    isServiceFee: true,
  },
  {
    pid: 20,
    farmId: 20,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "KPETS-ETH LP",
    lpAddress: "0x919c3D39536dB1bb35dD09FFabE8a436924831c4",
    contractAddress: "0xAc82531cfb82680c5654f31F3Ee78BCfd5422779",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).kpets,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).kpets,
    // reflectionToken: serializeTokens(ChainId.ETHEREUM).kpets,
    isServiceFee: true,
    isFinished: true,
    enableEmergencyWithdraw: true,
  },
  {
    pid: 24,
    farmId: 24,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "KPETS-ETH LP",
    lpAddress: "0x919c3D39536dB1bb35dD09FFabE8a436924831c4",
    contractAddress: "0x023242FeF2B5083432595bF0b6C9142aF3762764",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).kpets,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).kpets,
    // reflectionToken: serializeTokens(ChainId.ETHEREUM).kpets,
    isServiceFee: true,
  },
  {
    pid: 21,
    farmId: 21,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "GVR-ETH LP",
    lpAddress: "0x1f1B4836Dde1859e2edE1C6155140318EF5931C2",
    contractAddress: "0xa1F66f00d81CB7b41D15CAd7afCCcFB2ab306C86",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).gvr,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).gvr,
    // reflectionToken: serializeTokens(ChainId.ETHEREUM).gvr,
    isServiceFee: true,
  },
  {
    pid: 22,
    farmId: 22,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "RKT-ETH LP",
    lpAddress: "0xD87A52037D166d20E74Abc10CE0eA743e11BAf14",
    contractAddress: "0x341DFCA5E79cCdc7751E3315924485648646dE49",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).rkt,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).rkt,
    reflectionToken: serializeTokens(ChainId.ETHEREUM).rkt,
    isServiceFee: true,
    isFinished: true,
    enableEmergencyWithdraw: true,
  },
  {
    pid: 23,
    farmId: 23,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "WPT-ETH LP",
    lpAddress: "0x638996A1327AC6FC0770d543374E0055EfFa2B1d",
    contractAddress: "0x2040726132171f2F9472b1Bd0E5CeAdb3BAE002C",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).wpt,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).wpt,
    isServiceFee: true,
  },
  {
    pid: 25,
    farmId: 25,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "RKT-ETH LP",
    lpAddress: "0xD87A52037D166d20E74Abc10CE0eA743e11BAf14",
    contractAddress: "0x5B6cFfc4B7911f8fEF0f5A4aB8639Ea203a1b634",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).rkt,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).rkt,
    reflectionToken: serializeTokens(ChainId.ETHEREUM).rkt,
    isServiceFee: true,
    isFinished: true,
  },
  {
    pid: 26,
    farmId: 26,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "Ly-ETH LP",
    lpAddress: "0xC05371628F77cd274D111EC9621B5D85f5945da2",
    contractAddress: "0xb7Bf53a3c203e9A27EcaAdE8f09Cc4e2318126E2",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).ly,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).ly,
    isServiceFee: true,
  },
  {
    pid: 27,
    farmId: 27,
    poolId: 0,
    chainId: ChainId.BSC_MAINNET,
    version: Version.V3,
    lpSymbol: "BALTO-BNB LP",
    lpAddress: "0x6b75970104032cE9720902Cea0A0E57Ce24a6077",
    contractAddress: "0x6566f1694F58912D8D74eA9207C403f02740435f",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.BSC_MAINNET).balto,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
    earningToken: serializeTokens(ChainId.BSC_MAINNET).balto,
    isServiceFee: true,
  },
  {
    pid: 28,
    farmId: 28,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "IXP-ETH LP",
    lpAddress: "0x0F607B573723d70c49495fD3b49eeC6e9B2ebD27",
    contractAddress: "0xB8Df744e82D8bbE1E506D568e852E05b81613a70",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).ixp,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).ixp,
    isServiceFee: true,
  },
  {
    pid: 29,
    farmId: 29,
    poolId: 0,
    chainId: ChainId.ETHEREUM,
    version: Version.V3,
    lpSymbol: "MET-ETH LP",
    lpAddress: "0xAB429083fe81160a1ba0EdDFB16BD7ec406A8c7C",
    contractAddress: "0xEcD659a1D9ad3994dd03F29EAAD470356ea7a7F2",
    lpManager: "Pancakeswap",
    token: serializeTokens(ChainId.ETHEREUM).met,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
    earningToken: serializeTokens(ChainId.ETHEREUM).met,
    isServiceFee: true,
  },
];

export default farms;

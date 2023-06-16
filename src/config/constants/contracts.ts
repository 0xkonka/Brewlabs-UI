import { AppId, Chef } from "./types";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  masterChef: {
    97: "0x98b27B9E4C11611B282c4ED9f8d48e876DBd2bE1",
    56: "0x479EBabB0e8870188Aa1700489054Ec489a6AB28",
  },
  farmFactory: {
    1: "0xB35dB6963Ee19Fad44bA2a30aA6D3730572F894d",
    56: "0xe8F5d6E471CDd8Bc1Ec180DD2bf31cF16A8b72cc",
  },
  indexFactory: {
    56: "0xb3daffCe98a637714A3d4FE06BcBF57eAA36E70C",
    97: "0x3D93f5c60A7893169A6e895cEaD3d0663f622455",
  },
  lpManager: {
    1: "0xd6A74757F3F307931f94a62331FB4D8884e3cc56",
    56: "0x49dcF1d27556A818105bbB349DD2daC7A95c3F16",
  },
  tokenTransfer: {
    1: "0xc77adCB9aeCcecC955A037913B87347138E25983",
    97: "0x19371B795Fd7A1263C649C715Ee906E3a3fe16d0",
    56: "0x27480f197b7B3EC16Be1ee990caF9E245bb021e8",
  },
  multiCall: {
    1: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    5: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
    56: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
    42161: "0x842eC2c7D803033Edf55E478F461FC547Bc54EB2",
    97: "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576",
    137: "0x35e4aA226ce52e1E59E5e5Ec24766007bCbE2e7D",
    80001: "0x01173890E45aA0f694B68eB89Cb63B295b439FC3",
    250: "0x214346982F0CF49C689eD83AA94a03476FC7D1F0",
    43114: "0x6d6cF5767651F68EFb3EC1d9d7d1d93f9A41Eedc",
    25: "0x5e954f5972EC6BFc7dECd75779F10d848230345F",
  },
  aggregator: {
    1: '0xd4B1Fc5fA08ccd715C646cE4FD78722F61295bf7',
    56: '0xb87B0c7A5aD2f3c1A4909a7768C7AF22F20c494b',
    97: '0x8dcd7a61101Cd522457F0Ef414B00d896cC95043',
    137: '0xf797613f887638bDcdCFF906BF9864DcF1f77d21',
    250: '0x1088DD01E367E7A646fB2cD6d877FcD8802E7da2',
    42161: '0xf8952FD9872ccB2255a08dF882609754C88002E7',
  },
  zapper: {
    1: "0x23C5bA2b826A45421DDd25DF8887623789F092da",
    56: "0xdEB6545B0D3E68bd40F2B119A5B1C46AC91Cb7d9",
  },
  externalMasterChef: {
    [AppId.APESWAP]: "0x78B5C0C1577877F62372db085aC6d9e33EF61872",
    [AppId.PANCAKESWAP]: "0xCbb70b0481BD6832d359cEAC769134229912E8AF",
    [AppId.SUSHISWAP]: {
      [Chef.MASTERCHEF]: "0xc2C799086cDFb54F97237884DF2dbac5547443Af",
      [Chef.MASTERCHEF_V2]: "0x148647C611F337b327B1a22592A58f16Cd7D0404",
    },
  },
  verification: {
    1: "0x4f8385a5Aa5b33aB23bf13abd23a2B62F08f06AC",
    56: "0x0484e5046654E274A491A15c78CB86BD53a1F21B",
  },
  pancakeMasterChef: {
    56: "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652",
  },
  banana: {
    56: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  },
  masterApe: {
    56: "0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9",
  },
  apePriceGetter: {
    56: "0x5e545322b83626c745FE46144a15C00C94cBD803",
  },
  nativeWrapped: {
    56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  brewlabsAggregationRouter: {
    1: "0x6419c300aDB2C25a725111cE8D35a3994B782257",
    56: "0x4E0ee5a50e39f7e42d971dE53736129e52a5b0Ab",
  },
  brewlabsFeeManager: {
    1: "",
    56: "",
    97: "0x61619e55bcf0550d1C05bEE5d11F746e8793b34d"
  },
};

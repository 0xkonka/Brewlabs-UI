import { ChainId } from "@brewlabs/sdk";
import { serializeTokens } from "../tokens";
import { SerializedFarmConfig } from "../types";

export const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absence of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DEXI-BNB LP",
    lpAddress: "0xBf1Ad213fe67cee0170056db50Dd519655BC3635",
    token: serializeTokens(ChainId.BSC_MAINNET).dexi,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DXG-BNB LP",
    lpAddress: "0x0e9A18f9c07c6Ab7Fa1E97e75aC84fE6D00b4A0D",
    token: serializeTokens(ChainId.BSC_MAINNET).dxg,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BBFT-BNB LP",
    lpAddress: "0xE61fe5f8a7cb804477eb218d22069c4aA2Cb595F",
    token: serializeTokens(ChainId.BSC_MAINNET).bbft,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "PCH-BNB LP",
    lpAddress: "0x9f67a51F4d77aAE8496A15148887Fd7aD12ed2cC",
    token: serializeTokens(ChainId.BSC_MAINNET).pch,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BACCA-BNB LP",
    lpAddress: "0x1204497fBCE0C69891c5bfe4cdA5399E28Ac0eB8",
    token: serializeTokens(ChainId.BSC_MAINNET).bacca,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "MAIR-BNB LP",
    lpAddress: "0x5eE0fff30e78762624F507058eC772Af526e656e",
    token: serializeTokens(ChainId.BSC_MAINNET).mair,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "UKRRiseUp-BNB LP",
    lpAddress: "0xBd58BaCDAA28793c6C2c7CBf0c97C68e811a3E07",
    token: serializeTokens(ChainId.BSC_MAINNET).ukrriseup,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DOX-BNB LP",
    lpAddress: "0xFD4213421c97d4555E7b904158E3A312C1d3D513",
    token: serializeTokens(ChainId.BSC_MAINNET).dox,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BUSDM-BNB LP",
    lpAddress: "0x246cd8aA4800D3aF25b934375c1D9c33a887f07B",
    token: serializeTokens(ChainId.BSC_MAINNET).busdm,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DWT-BNB LP",
    lpAddress: "0x7364919f0eE9fB8DEfC88d0cc4CeC18387E898E5",
    token: serializeTokens(ChainId.BSC_MAINNET).dwt,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DVFB-BNB LP",
    lpAddress: "0x820b5952e79eBfbbA81FC6E20131c694eF02Fd04",
    token: serializeTokens(ChainId.BSC_MAINNET).dvfb,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BULLY-BNB LP",
    lpAddress: "0xd79093337523269c0A758500517aa1C0D618CA9f",
    token: serializeTokens(ChainId.BSC_MAINNET).bully,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "GDT-BNB LP",
    lpAddress: "0x11cef9a89E8ecCFf1598Fa429b095630bEa6C5D2",
    token: serializeTokens(ChainId.BSC_MAINNET).gdt,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "EFT-BNB LP",
    lpAddress: "0xEbDA2eD709ce1CAFbcC8dd08b6F7C84A782E617c",
    token: serializeTokens(ChainId.BSC_MAINNET).eft,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "FREEDOM-BNB LP",
    lpAddress: "0x0b9dB5DA31b09ed6a114E2581B59714d580060dc",
    token: serializeTokens(ChainId.BSC_MAINNET).freedom,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "CVT-BNB LP",
    lpAddress: "0xb5b806E89a97c9D9cc8a3E2609Df56d2e8fc9618",
    token: serializeTokens(ChainId.BSC_MAINNET).cvt,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "REFLEX-BNB LP",
    lpAddress: "0x65392f798E30f2082D8d37415ec0336BB8832Ac9",
    token: serializeTokens(ChainId.BSC_MAINNET).reflex,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "TARP-BNB LP",
    lpAddress: "0x631AF28e12eac34EaF386c36d9f9Dd555Fb3F86B",
    token: serializeTokens(ChainId.BSC_MAINNET).tarp,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "VANTAGE-BNB LP",
    lpAddress: "0x6881545862f4D0306df6Dd113d8e26ecABC59A50",
    token: serializeTokens(ChainId.BSC_MAINNET).vantage,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "EGO-BNB LP",
    lpAddress: "0x7f2850eFc725b906e55Fc367eD3d588b539f00F9",
    token: serializeTokens(ChainId.BSC_MAINNET).ego,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "EFTa-BNB LP",
    lpAddress: "0x7865ad24628060a3AB3f6b95913b01B70Ca7327C",
    token: serializeTokens(ChainId.BSC_MAINNET).ethfan,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "EFB-BNB LP",
    lpAddress: "0xd3D1BA8eFfBEE837dF26684E92024385187FEA4e",
    token: serializeTokens(ChainId.BSC_MAINNET).efb,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "OGEM-BNB LP",
    lpAddress: "0xEE16bbb75196c84BC92D9a9FF126fFd65189BEBC",
    token: serializeTokens(ChainId.BSC_MAINNET).balto,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BTIV2-BNB LP",
    lpAddress: "0x60682fb0c47b19FACF638bf853b3b82Dc7394DD4",
    token: serializeTokens(ChainId.BSC_MAINNET).btiV2,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "BCAT-BNB LP",
    lpAddress: "0x5565a2bd8a1258A163F717C01995543019EC82b8",
    token: serializeTokens(ChainId.BSC_MAINNET).bcat,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "CTY-BNB LP",
    lpAddress: "0x4fE65B8bfe542792750bD88019B707278eA0B7b6",
    token: serializeTokens(ChainId.BSC_MAINNET).cty,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DRMCLUB-BNB LP",
    lpAddress: "0x180E01fd90843332FbaEd87c002E4B9D6cA14305",
    token: serializeTokens(ChainId.BSC_MAINNET).drmclub,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "H2ON-BNB LP",
    lpAddress: "0x191B063C514dc83Ed25297248B4a1c393f5D2c48",
    token: serializeTokens(ChainId.BSC_MAINNET).h2on,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "VFX-BNB LP",
    lpAddress: "0xFcC5600a818664CAA43EA4c490bD2de8D21a16bc",
    token: serializeTokens(ChainId.BSC_MAINNET).vfx,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "DR-BNB LP",
    lpAddress: "0xb218b01b58a2527F656BDb170e586215569c2061",
    token: serializeTokens(ChainId.BSC_MAINNET).dr,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "MFX-BNB LP",
    lpAddress: "0x48Ff173df521d6231c3f879Fbc1500dD477acEd7",
    token: serializeTokens(ChainId.BSC_MAINNET).mfx,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "LUNG-BNB LP",
    lpAddress: "0x0F008480DDC18b6BaC65863dCd4ebbEa0716E572",
    token: serializeTokens(ChainId.BSC_MAINNET).lung,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "HEROS-BNB LP",
    lpAddress: "0x44047cDEF4CEF8469Af65832A56040f3F62795D3",
    token: serializeTokens(ChainId.BSC_MAINNET).heros,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "ProX-BNB LP",
    lpAddress: "0xCE783928d656166e9270E8642559F1Bbe8412d5a",
    token: serializeTokens(ChainId.BSC_MAINNET).prox,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  {
    pid: null,
    chainId: ChainId.BSC_MAINNET,
    lpSymbol: "ROO-BNB LP",
    lpAddress: "0x2C97b52D9390590ef0Dd4346188d82431a9CdE88",
    token: serializeTokens(ChainId.BSC_MAINNET).roo,
    quoteToken: serializeTokens(ChainId.BSC_MAINNET).wbnb,
  },
  // ethereum
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "USDT-ETH LP",
    lpAddress: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    token: serializeTokens(ChainId.ETHEREUM).usdt,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "$SHARI-ETH LP",
    lpAddress: "0x12a1ECC63E290E64239425409103e16274E53C43",
    token: serializeTokens(ChainId.ETHEREUM).shari,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "SAITAMA-ETH LP",
    lpAddress: "0x9cbfB60A09A9a33a10312dA0f39977CbDb7fdE23",
    token: serializeTokens(ChainId.ETHEREUM).saitama,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "KoaCombat-ETH LP",
    lpAddress: "0x9c14bf7A0275a521835d2788fF3a2c1EeE9eaCB3",
    token: serializeTokens(ChainId.ETHEREUM).koaCombat,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "SHAMAN-ETH LP",
    lpAddress: "0x9B4a421BDF48F44a7327DcdE1DC741009E379899",
    token: serializeTokens(ChainId.ETHEREUM).shaman,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "ETHDOX-ETH LP",
    lpAddress: "0xAeB93A8d29962d63aF33f60dBB2A5AEe37fB39f5",
    token: serializeTokens(ChainId.ETHEREUM).ethdox,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "HONR-ETH LP",
    lpAddress: "0x7bA88e8596B6E5C6e3f1538B1495fAD549A7a1F1",
    token: serializeTokens(ChainId.ETHEREUM).honr,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "SHIFT-ETH LP",
    lpAddress: "0xCD4d1296330a20855062C9667e088612FfF3c151",
    token: serializeTokens(ChainId.ETHEREUM).shift,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "TITN-ETH LP",
    lpAddress: "0x93116dD832c83E87DDFd639faDe8a36d29595a85",
    token: serializeTokens(ChainId.ETHEREUM).titn,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "SCARD-ETH LP",
    lpAddress: "0xE9413B29464cd2DBC72a9ef7260D9bC3532dDAC3",
    token: serializeTokens(ChainId.ETHEREUM).scard,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "VOLTZ-ETH LP",
    lpAddress: "0x8acE8547b8326CeaCd955140A4F2760b4bc4F94a",
    token: serializeTokens(ChainId.ETHEREUM).voltz,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "DRYP-ETH LP",
    lpAddress: "0x85C26aeF6f5186ce61622897A0160dc2c6342d36",
    token: serializeTokens(ChainId.ETHEREUM).dryp,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "KPETS-ETH LP",
    lpAddress: "0x919c3D39536dB1bb35dD09FFabE8a436924831c4",
    token: serializeTokens(ChainId.ETHEREUM).kpets,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "SHIFT-ETH LP",
    lpAddress: "0x7D659c4fCd387b3d219E15EC104DE319352a7167",
    token: serializeTokens(ChainId.ETHEREUM).shift2,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "FLIP-ETH LP",
    lpAddress: "0x923693F167Ed56a529f191012B1523a4CE697246",
    token: serializeTokens(ChainId.ETHEREUM).flip,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "REIT-ETH LP",
    lpAddress: "0x7afBEb90B3f15d378E59F741dCA38f4b07653B9c",
    token: serializeTokens(ChainId.ETHEREUM).reit,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "TRT-ETH LP",
    lpAddress: "0xd9581bEc4C84E82Fc7658141CB94db6cC1Df6eB0",
    token: serializeTokens(ChainId.ETHEREUM).trt,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "JIGSAW-ETH LP",
    lpAddress: "0x27852181b10c6Aa95440d9f53AF70D123178a0d8",
    token: serializeTokens(ChainId.ETHEREUM).jigsaw,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "HEROS-ETH LP",
    lpAddress: "0x9Ce9b30a6ca7c380522A88C85BE614a700A7A259",
    token: serializeTokens(ChainId.ETHEREUM).heros,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "ROO-ETH LP",
    lpAddress: "0xFF578AC8eF9Df9d02368842b7B0810A14e770d71",
    token: serializeTokens(ChainId.ETHEREUM).roo,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "MMTKN-ETH LP",
    lpAddress: "0xcf3F1359013a002FD97735275101543D34E89d7c",
    token: serializeTokens(ChainId.ETHEREUM).mmtkn,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  {
    pid: null,
    chainId: ChainId.ETHEREUM,
    lpSymbol: "ALCAZAR-ETH LP",
    lpAddress: "0xcf3F1359013a002FD97735275101543D34E89d7c",
    token: serializeTokens(ChainId.ETHEREUM).alcazar,
    quoteToken: serializeTokens(ChainId.ETHEREUM).weth,
  },
  // polygon
  {
    pid: null,
    chainId: ChainId.POLYGON,
    lpSymbol: "USDC-MATIC LP",
    lpAddress: "0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827",
    token: serializeTokens(ChainId.POLYGON).usdc,
    quoteToken: serializeTokens(ChainId.POLYGON).wmatic,
  },
  {
    pid: null,
    chainId: ChainId.POLYGON,
    lpSymbol: "MTBC-MATIC LP",
    lpAddress: "0xc656f969d4Cbe5534337496117240deC39553AC2",
    token: serializeTokens(ChainId.POLYGON).mtbc,
    quoteToken: serializeTokens(ChainId.POLYGON).wmatic,
  },
  // fantom
  {
    pid: null,
    chainId: ChainId.FANTOM,
    lpSymbol: "USDC-FTM LP",
    lpAddress: "0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c",
    token: serializeTokens(ChainId.FANTOM).usdc,
    quoteToken: serializeTokens(ChainId.FANTOM).wftm,
  },
  // avax
  {
    pid: null,
    chainId: ChainId.AVALANCHE,
    lpSymbol: "USDC-AVAX LP",
    lpAddress: "0xf4003F4efBE8691B60249E6afbD307aBE7758adb",
    token: serializeTokens(ChainId.AVALANCHE).usdc,
    quoteToken: serializeTokens(ChainId.AVALANCHE).wavax,
  },
  // cronos
  {
    pid: null,
    chainId: ChainId.CRONOS,
    lpSymbol: "USDC-CRO LP",
    lpAddress: "0xa68466208F1A3Eb21650320D2520ee8eBA5ba623",
    token: serializeTokens(ChainId.CRONOS).usdc,
    quoteToken: serializeTokens(ChainId.CRONOS).wcro,
  },
  // brise
  {
    pid: null,
    chainId: ChainId.BRISE,
    lpSymbol: "USDT-BRISE LP",
    lpAddress: "0x8C243D7b04e0F8F78DC87C8C2297581310468129",
    token: serializeTokens(ChainId.BRISE).usdt,
    quoteToken: serializeTokens(ChainId.BRISE).wbrise,
  },
];

import { ChainId, WNATIVE } from "@brewlabs/sdk";
import { AugmentedChainId, CHAIN_KEYS } from "config/constants/networks";
import { ASSET_PATH } from "config/constants/endpoints";
import { BAD_SRCS, BAD_SRCS_SUSHI } from "config/constants/lists";
import { AppId } from "config/constants/types";
import { DEXSCREENER_CHAINNAME, DEXTOOLS_CHAINNAME, DEX_GURU_CHAIN_NAME, TRUSTWALLET_ASSETS } from "config";

// `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;

const getTokenLogoURL = (address: string, chainId: AugmentedChainId, logo?: string, appId?: AppId, tokenSymbol?: string) => {
  if (logo) return [logo];
  if (!address) return [];
  if (address.toLowerCase() === "0x2f86747a9c5db9b80840a3a588e2b87f367188d6") return ["/images/brewlabs.jpg"];

  const existingLogo =
    appId === AppId.APESWAP
      ? BAD_SRCS.includes(tokenSymbol)
        ? `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${tokenSymbol?.toUpperCase()}.png`
        : `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${tokenSymbol?.toUpperCase()}.svg`
      : appId === AppId.PANCAKESWAP
      ? `https://pancakeswap.finance/images/tokens/${address}.png`
      : appId === AppId.SUSHISWAP
      ? Object.keys(BAD_SRCS_SUSHI).includes(address)
        ? BAD_SRCS_SUSHI[address]
        : `https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64,q_auto/tokens/1/${address}.jpg`
      : `${ASSET_PATH}/${CHAIN_KEYS[chainId]}/assets/${address ?? WNATIVE[chainId].address}/logo.png`;

  const dexGuruLogo = `https://assets-stage.dex.guru/icons/${address.toLowerCase()}-${
    DEX_GURU_CHAIN_NAME[chainId]
  }.jpg`;
  return [existingLogo, dexGuruLogo, dexGuruLogo.replace(".jpg", ".png")];
};

export default getTokenLogoURL;

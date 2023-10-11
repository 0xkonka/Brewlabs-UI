import { ChainId, Token } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceAmount } from "utils/formatBalance";
import { createSelector } from "@reduxjs/toolkit";
import { tokens } from "config/constants/tokens";
import { AppId } from "config/constants/types";
import { State, DeserializedPancakeFarm, Farm, SerializedPancakeFarm } from "state/types";
import { deserializeToken } from "state/user/hooks/helpers";
import { isAddress } from "utils";

const deserializeFarmUserData = (farm) => {
  return {
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
    totalRewards: farm.userData ? new BigNumber(farm.userData.totalRewards) : new BigNumber(0),
  };
};

const deserializePancakeFarm = (farm: SerializedPancakeFarm): DeserializedPancakeFarm => {
  const { lpAddress, lpSymbol, pid, multiplier, quoteTokenPriceBusd, tokenPriceBusd } = farm;

  return {
    appId: AppId.PANCAKESWAP,
    chainId: ChainId.BSC_MAINNET,
    lpAddress,
    lpSymbol,
    pid,
    multiplier,
    quoteTokenPriceBusd,
    tokenPriceBusd,
    token: deserializeToken(farm.token),
    quoteToken: deserializeToken(farm.quoteToken),
    earningToken: tokens[ChainId.BSC_MAINNET].cake,
    userData: deserializeFarmUserData(farm),
    tokenAmountTotal: farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : new BigNumber(0),
    quoteTokenAmountTotal: farm.quoteTokenAmountTotal ? new BigNumber(farm.quoteTokenAmountTotal) : new BigNumber(0),
    lpTotalInQuoteToken: farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : new BigNumber(0),
    lpTotalSupply: farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : new BigNumber(0),
    tokenPriceVsQuote: farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : new BigNumber(0),
    poolWeight: farm.poolWeight ? new BigNumber(farm.poolWeight) : new BigNumber(0),
    totalRewards: farm.totalRewards ? new BigNumber(farm.totalRewards) : new BigNumber(0),
    totalSupply: farm.totalSupply,
  };
};

const deserializeApeFarm = (farm: Farm) => {
  const { tokenSymbol, tokenAddresses, quoteTokenSymbol, quoteTokenAdresses, tokenDecimals, quoteTokenDecimals } = farm;

  const tokenAddress = isAddress(tokenAddresses[ChainId.BSC_MAINNET]);
  const quoteTokenAddress = isAddress(quoteTokenAdresses[ChainId.BSC_MAINNET]);

  return {
    ...farm,
    appId: AppId.APESWAP,
    chainId: ChainId.BSC_MAINNET,
    token: new Token(ChainId.BSC_MAINNET, tokenAddress || undefined, tokenDecimals ?? 18, tokenSymbol),
    quoteToken: new Token(
      ChainId.BSC_MAINNET,
      quoteTokenAddress || undefined,
      quoteTokenDecimals ?? 18,
      quoteTokenSymbol
    ),
    earningToken: tokens[ChainId.BSC_MAINNET].banana,
    userData: deserializeFarmUserData(farm),
  };
};

const deserializeSushiFarm = (farm) => {
  const { token0, token1 } = farm.pair;

  return {
    ...farm,
    appId: AppId.SUSHISWAP,
    chainId: ChainId.ETHEREUM,
    token: deserializeToken({
      ...token0,
      chainId: ChainId.ETHEREUM,
      address: isAddress(token0.id),
      decimals: Number(token0.decimals),
    }),
    quoteToken: deserializeToken({
      ...token1,
      chainId: ChainId.ETHEREUM,
      address: isAddress(token1.id),
      decimals: Number(token1.decimals),
    }),
    earningToken: tokens[ChainId.ETHEREUM].sushi,
    userData: deserializeFarmUserData(farm),
  };
};

const selectCakeFarm = (state: State) => state.zap.data[AppId.PANCAKESWAP].find((f) => f.pid === 39);
const selectFarmByKey = (key: string, value: string | number, appId: AppId) => (state: State) =>
  state.zap.data[appId].find((f) => f[key] === value);

export const makeUserFarmFromPidSelector = (pid: number, appId: AppId) =>
  createSelector([selectFarmByKey("pid", pid, appId)], (farm) => {
    const { stakedBalance, earnings } = deserializeFarmUserData(farm);
    return {
      stakedBalance,
      earnings,
    };
  });

export const priceCakeFromPidSelector = createSelector([selectCakeFarm], (cakeBnbFarm) => {
  const cakePriceBusdAsString = cakeBnbFarm.tokenPriceBusd;
  return new BigNumber(cakePriceBusdAsString);
});

export const makeLpTokenPriceFromLpSymbolSelector = (lpSymbol: string, appId: AppId) =>
  createSelector([selectFarmByKey("lpSymbol", lpSymbol, appId)], (farm) => {
    let lpTokenPrice = new BigNumber(0);

    if (appId === AppId.PANCAKESWAP) {
      const lpTotalInQuoteToken = farm.lpTotalInQuoteToken ? new BigNumber(farm.lpTotalInQuoteToken) : new BigNumber(0);
      const lpTotalSupply = farm.lpTotalSupply ? new BigNumber(farm.lpTotalSupply) : new BigNumber(0);

      if (lpTotalSupply.gt(0) && lpTotalInQuoteToken.gt(0)) {
        const farmTokenPriceInUsd = new BigNumber(farm.tokenPriceBusd);
        const tokenAmountTotal = farm.tokenAmountTotal ? new BigNumber(farm.tokenAmountTotal) : new BigNumber(0);
        const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(tokenAmountTotal);
        const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
        const totalLpTokens = getBalanceAmount(lpTotalSupply);
        lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
      }
    } else {
      lpTokenPrice = new BigNumber(farm?.lpValueUsd ?? BIG_ZERO);
    }

    return lpTokenPrice;
  });

export const farmsSelector = createSelector(
  (state: State) => state.zap,
  (zap) => {
    const { data, appId } = zap;
    // const farms = data[appId];
    // const deserializedFarmsData =
    //   appId === AppId.PANCAKESWAP
    //     ? farms.map(deserializePancakeFarm)
    //     : appId === AppId.APESWAP
    //     ? farms.map(deserializeApeFarm)
    //     : farms.map(deserializeSushiFarm);
    const deserializedFarmsData = [
      ...data[AppId.PANCAKESWAP].map(deserializePancakeFarm),
      ...data[AppId.APESWAP].map(deserializeApeFarm),
      ...data[AppId.SUSHISWAP].map(deserializeSushiFarm),
    ];

    const { userDataLoaded, poolLength, regularCakePerBlock } = zap;
    return {
      userDataLoaded,
      data: deserializedFarmsData,
      poolLength,
      regularCakePerBlock,
    };
  }
);

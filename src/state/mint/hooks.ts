/* eslint-disable react-hooks/exhaustive-deps */
import {
  Currency,
  CurrencyAmount,
  JSBI,
  NATIVE_CURRENCIES,
  Pair,
  Percent,
  Price,
  Token,
  TokenAmount,
} from "@brewlabs/sdk";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "contexts/localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useCurrency } from "hooks/Tokens";
import { PairState, usePair } from "hooks/usePairs";
import useTotalSupply from "hooks/useTotalSupply";
import { wrappedCurrency, wrappedCurrencyAmount } from "utils/wrappedCurrency";

import { tryParseAmount } from "../swap/hooks";
import { useCurrencyBalances } from "../wallet/hooks";
import { AppDispatch, AppState } from "../index";
import { Field, selectCurrency, typeInput } from "./actions";

const ZERO = JSBI.BigInt(0);

export function useMintState(): AppState["mint"] {
  return useSelector<AppState, AppState["mint"]>((state) => state.mint);
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void;
  onFieldBInput: (typedValue: string) => void;
  onCurrencySelection: (field: Field, currency: Currency) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }));
    },
    [dispatch, noLiquidity]
  );
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }));
    },
    [dispatch, noLiquidity]
  );

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency.isNative ? "ETH" : "",
        })
      );
    },
    [dispatch]
  );

  return {
    onFieldAInput,
    onFieldBInput,
    onCurrencySelection,
  };
}

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  dexId?: string
): {
  dependentField: Field;
  currencies: { [field in Field]?: Currency };
  pair?: Pair | null;
  pairState: PairState;
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  price?: Price;
  noLiquidity?: boolean;
  liquidityMinted?: TokenAmount;
  poolTokenPercentage?: Percent;
  error?: string;
} {
  const { account, chainId } = useActiveWeb3React();

  const { t } = useTranslation();

  const {
    independentField,
    typedValue,
    otherTypedValue,
    [Field.CURRENCY_A]: { currencyId: inputCurrencyId },
    [Field.CURRENCY_B]: { currencyId: outputCurrencyId },
  } = useMintState();

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  // tokens

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);

  const currencies: { [field in Field]?: Currency } = {
    [Field.CURRENCY_A]: currencyA ?? inputCurrency ?? undefined,
    [Field.CURRENCY_B]: currencyB ?? outputCurrency ?? undefined,
  };

  // pair
  const [pairState, pair] = usePair(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B], false, dexId);

  const totalSupply = useTotalSupply(pair?.liquidityToken);

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO));

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ]);
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  };

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField]);
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField]);
      }
      return undefined;
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId);
      const [tokenA, tokenB] = [
        wrappedCurrency(currencies[Field.CURRENCY_A], chainId),
        wrappedCurrency(currencies[Field.CURRENCY_B], chainId),
      ];
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency =
          dependentField === Field.CURRENCY_B ? currencies[Field.CURRENCY_B] : currencies[Field.CURRENCY_A];
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount);
        return dependentCurrency.isNative
          ? new CurrencyAmount(NATIVE_CURRENCIES[chainId], dependentTokenAmount.raw)
          : dependentTokenAmount;
      }
      return undefined;
    }
    return undefined;
  }, [
    noLiquidity,
    otherTypedValue,
    currencies,
    dependentField,
    independentAmount,
    currencyA,
    chainId,
    currencyB,
    pair,
  ]);

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    }),
    [dependentAmount, independentAmount, independentField]
  );

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts;
      if (currencyAAmount && currencyBAmount) {
        return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw);
      }
      return undefined;
    }
    const wrappedCurrencyA = wrappedCurrency(currencies[Field.CURRENCY_A], chainId);
    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined;
  }, [chainId, currencies[Field.CURRENCY_A], noLiquidity, pair, parsedAmounts]);

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts;
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId),
    ];

    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  }, [parsedAmounts, chainId, pair, totalSupply]);

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw);
    }
    return undefined;
  }, [liquidityMinted, totalSupply]);

  let error: string | undefined;
  if (!account) {
    error = t("Connect Wallet");
  }

  if (pairState === PairState.INVALID) {
    error = error ?? t("Invalid pair");
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? t("Enter an amount");
  }

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts;

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    error = t("Insufficient %symbol% balance", { symbol: currencies[Field.CURRENCY_A]?.symbol });
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    error = t("Insufficient %symbol% balance", { symbol: currencies[Field.CURRENCY_B]?.symbol });
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  };
}

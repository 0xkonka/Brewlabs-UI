import { Currency, CurrencyAmount, JSBI, Token, TokenAmount, Trade } from '@brewlabs/sdk'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { selectCurrency, typeInput } from './actions'

export function useChartState(): AppState['chart'] {
  return useSelector<AppState, AppState['chart']>((state) => state.chart)
}

export function useChartActionHandlers(): {
  onCurrencySelection: (currency: Currency) => void
  onUserInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (currency: Currency) => {
      dispatch(
        selectCurrency({
          currencyId: currency instanceof Token ? currency.address : currency.isNative ? 'ETH' : '',
        }),
      )
    },
    [dispatch],
  )

  const onUserInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ typedValue }))
    },
    [dispatch],
  )

  return {
    onCurrencySelection,
    onUserInput,
  }
}
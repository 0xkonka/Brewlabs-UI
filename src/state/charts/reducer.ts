import { createReducer } from '@reduxjs/toolkit'
import { selectCurrency, typeInput } from './actions'

export interface ChartsState {
  readonly typedValue: string
  readonly currency: string | undefined
  // the typed recipient address or ENS name, or null if charts should go to sender
  readonly recipient: string | null
}

const initialState: ChartsState = {
  currency: '',
  typedValue: '',
  recipient: null,
}

export default createReducer<ChartsState>(initialState, (builder) =>
  builder
    .addCase(selectCurrency, (state, { payload: { currencyId } }) => {
      return {
        ...state,
        currency: currencyId ,
      }
    })
    .addCase(typeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        typedValue,
      }
    })
)

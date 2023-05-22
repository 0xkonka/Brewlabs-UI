import { createAction } from '@reduxjs/toolkit'

export const selectCurrency = createAction<{ currencyId: string }>('charts/selectCurrency')
export const typeInput = createAction<{ typedValue: string }>('charts/typeInput')
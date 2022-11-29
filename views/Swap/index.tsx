import { useState, useEffect, useMemo } from "react";

import { CurrencyAmount, Price } from "@brewlabs/sdk";
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'

import { useTranslation } from "contexts/Localization";

import { AggregationRouterV4, slippageWithTVL, slippageDefault } from 'config/constants'

import { Field } from 'state/swap/actions'
import { useSwapState, useSwapActionHandlers, useDerivedSwapInfo, useDefaultsFromURLSearch } from "state/swap/hooks";
import { useUserSlippageTolerance, useIsExpertMode } from "state/user/hooks";

import maxAmountSpend from "utils/maxAmountSpend";
import { getAggregatorAddress } from 'utils/addressHelpers'

import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import CurrencyInputPanel from "components/CurrencyInputPanel";
import SubNav from "./components/SubNav";
import ChainSelect from "./components/ChainSelect";
import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";

export default function Swap() {
  const { account, library, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  useDefaultsFromURLSearch()

  const [quoteData, setQuoteData] = useState({})
  const [outputAmount, setOutputAmount] = useState<CurrencyAmount>()
  const [slippageInput, setSlippageInput] = useState('')
  const [autoMode, setAutoMode] = useState<boolean>(true)
  const [basePrice, setBasePrice] = useState<Price>()
  const [quotePrice, setQuotePrice] = useState<Price>()
  const [onTyping, setTyping] = useState<boolean>(false)
  const [parsedAmount, setParsedAmount] = useState<BigNumber>()
  const [buyTax, setBuyTax] = useState<number>(0)
  const [sellTax, setSellTax] = useState<number>(0)
  const [slippage, setSlippage] = useState<number>(50)
  const [verified, setVerified] = useState<boolean>(false)

  const expertMode = useIsExpertMode()

  // swap state
  const { typedValue } = useSwapState()
  const { currencies, currencyBalances, parsedAmount: inputAmount, inputError } = useDerivedSwapInfo()

  const { onUserInput, onCurrencySelection, onSwitchTokens } = useSwapActionHandlers()

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()

  useEffect(() => {
    setTyping(true)
    const timer = setTimeout(() => {
      setTyping(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [typedValue])

  useEffect(() => {
    if (onTyping) return
    const inputedValue = !typedValue || typedValue === '' || typedValue === '.' ? '0' : typedValue
    const _amount = parseUnits(inputedValue, currencies[Field.INPUT]?.decimals)
    setParsedAmount(_amount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTyping, typedValue, currencies[Field.INPUT]])

  // get the max amounts user can swap
  const maxAmounts = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmount = maxAmounts?.equalTo(inputAmount ?? '0')

  const aggregatorAddress = getAggregatorAddress(chainId)
  const [approval, approveCallback] = useApproveCallback(inputAmount, AggregationRouterV4[chainId])

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Exchange Tokens at the <WordHighlight content="best" /> rate on the market.
          </>
        }
        summary="Exchange Tokens at the best rate on the market."
      />

      <Container>
        <div className="mx-auto mb-4" style={{ maxWidth: "500px" }}>
          <div className="grid auto-rows-auto" style={{ gap: "4px" }}>
            <SubNav />
            <ChainSelect />
            <CurrencyInputPanel label="Sell" />
            <SwitchIconButton />
            <CurrencyInputPanel label="Buy" />
            <History />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

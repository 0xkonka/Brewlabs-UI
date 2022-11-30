import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { CurrencyAmount, Price, WNATIVE } from "@brewlabs/sdk";
import { ethers, BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'

import { useTranslation } from "contexts/localization";

import { AggregationRouterV4, slippageWithTVL, slippageDefault } from 'config/constants'
import { usdToken } from 'config/constants/tokens'
import AggregaionRouterV2Abi from 'config/abi/AggregationRouterV4.json'

import { Field } from 'state/swap/actions'
import { useSwapState, useSwapActionHandlers, useDerivedSwapInfo, tryParseAmount, useDefaultsFromURLSearch } from "state/swap/hooks";
import { useUserSlippageTolerance, useIsExpertMode } from "state/user/hooks";

import { calculateTotalGas } from 'utils'
import maxAmountSpend from "utils/maxAmountSpend";
import { getAggregatorAddress } from 'utils/addressHelpers'
import { quote, swap, ETHER_ADDRESS } from 'utils/aggregator'
import { BIG_ONE } from 'utils/bigNumber'
import { getTokenInfo } from 'utils/getTokenInfo'
import {
  getAggregatorContract,
  getBep20Contract,
  getVerificationContract
} from 'utils/contractHelpers'

import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import CurrencyInputPanel from "components/currencyInputPanel";
import SubNav from "./components/SubNav";
import ChainSelect from "./components/ChainSelect";
import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";

type TxResponse = TransactionResponse | null

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

  const price = useMemo(() => {
    if (
      !inputAmount ||
      !outputAmount ||
      !currencies[Field.INPUT] ||
      !currencies[Field.OUTPUT] ||
      inputAmount.equalTo(0)
    )
      return undefined
    return new Price(currencies[Field.INPUT], currencies[Field.OUTPUT], inputAmount.raw, outputAmount.raw)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], inputAmount, outputAmount])

  useEffect(() => {
    const fetchData = async () => {
      if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT] || !parsedAmount || parsedAmount?.isZero()) {
        setQuoteData({})
        setOutputAmount(undefined)
        return
      }

      const data = await quote(chainId, currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount)
      if (data) {
        if (!data.statusCode) {
          setQuoteData(data)
          const formattedAmount = formatUnits(data.toTokenAmount, data.toToken.decimals)
          const _outputAmount = tryParseAmount(formattedAmount, currencies[Field.OUTPUT])
          setOutputAmount(_outputAmount)
        } else {
          toast.error(data.description)
          setQuoteData({})
          const _outputAmount = tryParseAmount('0', currencies[Field.OUTPUT])
          setOutputAmount(_outputAmount)
        }
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount])

  useEffect(() => {
    if (currencies[Field.INPUT]) {
      const oneEther = parseUnits(BIG_ONE.toString(), currencies[Field.INPUT].decimals)
      if (currencies[Field.INPUT].equals(usdToken[chainId])) {
        const usdPrice = new Price(currencies[Field.INPUT], usdToken[chainId], oneEther.toString(), oneEther.toString())
        setBasePrice(usdPrice)
      }
      else {
        const fetchData = async () => {
          const data = await quote(chainId, currencies[Field.INPUT], usdToken[chainId], oneEther)
          if (!data.statusCode) {
            const _price = new Price(currencies[Field.INPUT], usdToken[chainId], oneEther.toString(), data.toTokenAmount)
            setBasePrice(_price)
          }
        }
        fetchData()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT]])

  useEffect(() => {
    if (currencies[Field.OUTPUT]) {
      const oneEther = parseUnits(BIG_ONE.toString(), currencies[Field.OUTPUT].decimals)
      if (currencies[Field.OUTPUT].equals(usdToken[chainId])) {
        const usdPrice = new Price(currencies[Field.OUTPUT], usdToken[chainId], oneEther.toString(), oneEther.toString())
        setQuotePrice(usdPrice)
      }
      else {
        const fetchData = async () => {
          const data = await quote(chainId, currencies[Field.OUTPUT], usdToken[chainId], oneEther)
          if (!data.statusCode) {
            const _price = new Price(currencies[Field.OUTPUT], usdToken[chainId], oneEther.toString(), data.toTokenAmount)
            setQuotePrice(_price)
          }
        }
        fetchData()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.OUTPUT]])

  useEffect(() => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      const fetchData = async () => {
        try {
          const baseTokenInfo = await getTokenInfo(chainId, currencies[Field.INPUT])
          const tokenInfo = await getTokenInfo(chainId, currencies[Field.OUTPUT])
          setBuyTax(tokenInfo?.BuyTax ?? 0)
          setSellTax(tokenInfo?.SellTax ?? 0)
          const totalTax = (Math.max(baseTokenInfo.BuyTax, baseTokenInfo.SellTax) + Math.max(tokenInfo.BuyTax, tokenInfo.SellTax)) * 100
          setSlippage(totalTax + (totalTax ? slippageWithTVL : slippageDefault))
        } catch (err) {
          console.error(err)
          setSlippage(slippageDefault)
        }
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT]])

  useEffect(() => {
    if (currencies[Field.OUTPUT]) {
      const checkVerification = async () => {
        try {
          const verificationContract = getVerificationContract(chainId, library?.getSigner())
          const balance = await verificationContract.balanceOf(
            currencies[Field.OUTPUT].isNative ? WNATIVE[chainId].address : currencies[Field.OUTPUT].address
          )
          if (balance.toNumber()) {
            setVerified(true)
          } else {
            setVerified(false)
          }
        } catch (err) {
          console.error(err)
          setVerified(false)
        }
      }
      checkVerification()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.OUTPUT]])

  const pendingText = t('Exchanging %amountA% %symbolA% to %amountB% %symbolB%', {
    amountA: inputAmount?.toSignificant(6) ?? '',
    symbolA: currencies[Field.INPUT]?.symbol ?? '',
    amountB: outputAmount?.toSignificant(6) ?? '',
    symbolB: currencies[Field.OUTPUT]?.symbol ?? '',
  })

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      onUserInput(Field.INPUT, '')
    },
    [onCurrencySelection, onUserInput],
  )
  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
    },
    [onCurrencySelection],
  )

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value)
    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(valueAsIntFromRoundedFloat)
      }
    } catch (error) {
      console.error(error)
    }
  }

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

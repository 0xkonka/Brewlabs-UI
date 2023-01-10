import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { Currency, CurrencyAmount, Price, WNATIVE } from "@brewlabs/sdk";
import { ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";

import { useTranslation } from "contexts/localization";

import { AggregationRouterV5, slippageWithTVL, slippageDefault } from "config/constants";
import contracts from "config/constants/contracts";
import { usdToken } from "config/constants/tokens";
import AggregaionRouterV2Abi from "config/abi/AggregationRouterV5.json";

import { Field } from "state/swap/actions";
import {
  useSwapState,
  useSwapActionHandlers,
  useDerivedSwapInfo,
  tryParseAmount,
  useDefaultsFromURLSearch,
} from "state/swap/hooks";
import { useUserSlippageTolerance, useIsExpertMode } from "state/user/hooks";

import { calculateTotalGas } from "utils";
import maxAmountSpend from "utils/maxAmountSpend";
import { getBrewlabsAggregationRouterAddress, addressWithout0x } from "utils/addressHelpers";
import { quote, swap, ETHER_ADDRESS } from "utils/aggregator";
import { BIG_ONE } from "utils/bigNumber";
import { getTokenInfo } from "utils/getTokenInfo";
import { getAggregatorContract, getBep20Contract, getVerificationContract } from "utils/contractHelpers";

import CurrencySelect from "./CurrencySelect";
import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import CurrencyInputPanel from "components/currencyInputPanel";
import CurrencyOutputPanel from "components/currencyOutputPanel";
import Modal from "components/Modal";
import { PrimarySolidButton } from "components/button/index";
import Button from "components/Button";
import SubNav from "./components/SubNav";
import ChainSelect from "./components/ChainSelect";
import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";
import ApproveModal from "./components/modal/ApproveModal";
import { ContractMethodNoResultError, useSigner } from "wagmi";
import { motion } from "framer-motion";
import SettingModal from "./components/modal/SettingModal";
import { getBrewlabsAggregationRouterContract } from "../../utils/contractHelpers";
import { NodeNextRequest } from "next/dist/server/base-http/node";
import ProgressBar from "../../components/ProgressBar";
import { EXPLORER_URLS } from "config/constants/networks";

type TxResponse = TransactionResponse | null;

export default function Swap() {
  const { account, library, chainId } = useActiveWeb3React();
  const { data: signer } = useSigner();

  const { t } = useTranslation();

  useDefaultsFromURLSearch();

  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);

  const [quoteData, setQuoteData] = useState({});
  const [outputAmount, setOutputAmount] = useState<CurrencyAmount>();
  const [slippageInput, setSlippageInput] = useState("");
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [basePrice, setBasePrice] = useState<Price>();
  const [quotePrice, setQuotePrice] = useState<Price>();
  const [onTyping, setTyping] = useState<boolean>(false);
  const [parsedAmount, setParsedAmount] = useState<BigNumber>();
  const [buyTax, setBuyTax] = useState<number>(0);
  const [sellTax, setSellTax] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(50);
  const [verified, setVerified] = useState<boolean>(false);

  const expertMode = useIsExpertMode();

  // swap state
  const { typedValue } = useSwapState();
  const { currencies, currencyBalances, parsedAmount: inputAmount, inputError } = useDerivedSwapInfo();

  const { onUserInput, onCurrencySelection, onSwitchTokens } = useSwapActionHandlers();

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>("");
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();

  useEffect(() => {
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [typedValue]);

  useEffect(() => {
    if (onTyping) return;
    const inputedValue = !typedValue || typedValue === "" || typedValue === "." ? "0" : typedValue;
    const _amount = parseUnits(inputedValue, currencies[Field.INPUT]?.decimals);
    setParsedAmount(_amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTyping, typedValue, currencies[Field.INPUT]]);

  // get the max amounts user can swap
  const maxAmounts = maxAmountSpend(currencyBalances[Field.INPUT]);
  const atMaxAmount = maxAmounts?.equalTo(inputAmount ?? "0");

  const aggregatorAddress = getBrewlabsAggregationRouterAddress(chainId);
  const [approval, approveCallback] = useApproveCallback(inputAmount, AggregationRouterV5[chainId]);

  const [inputCurrencySelect, setInputCurrencySelect] = useState(false);
  const [outputCurrencySelect, setOutputCurrencySelect] = useState(false);

  const price = useMemo(() => {
    if (
      !inputAmount ||
      !outputAmount ||
      !currencies[Field.INPUT] ||
      !currencies[Field.OUTPUT] ||
      inputAmount.equalTo(0)
    )
      return undefined;
    return new Price(currencies[Field.INPUT], currencies[Field.OUTPUT], inputAmount.raw, outputAmount.raw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], inputAmount, outputAmount]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT] || !parsedAmount || parsedAmount?.isZero()) {
        setQuoteData({});
        setOutputAmount(undefined);
        return;
      }

      const data = await quote(chainId, currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount);
      if (data) {
        if (!data.statusCode) {
          setQuoteData(data);
          const formattedAmount = formatUnits(data.toTokenAmount, data.toToken.decimals);
          const _outputAmount = tryParseAmount(formattedAmount, currencies[Field.OUTPUT]);
          setOutputAmount(_outputAmount);
        } else {
          toast.error(data.description);
          setQuoteData({});
          const _outputAmount = tryParseAmount("0", currencies[Field.OUTPUT]);
          setOutputAmount(_outputAmount);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount]);

  useEffect(() => {
    if (currencies[Field.INPUT]) {
      const oneEther = parseUnits(BIG_ONE.toString(), currencies[Field.INPUT].decimals);
      if (currencies[Field.INPUT].equals(usdToken[chainId])) {
        const usdPrice = new Price(
          currencies[Field.INPUT],
          usdToken[chainId],
          oneEther.toString(),
          oneEther.toString()
        );
        setBasePrice(usdPrice);
      } else {
        const fetchData = async () => {
          const data = await quote(chainId, currencies[Field.INPUT], usdToken[chainId], oneEther);
          if (!data.statusCode) {
            const _price = new Price(
              currencies[Field.INPUT],
              usdToken[chainId],
              oneEther.toString(),
              data.toTokenAmount
            );
            setBasePrice(_price);
          }
        };
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT]]);

  useEffect(() => {
    if (currencies[Field.OUTPUT]) {
      const oneEther = parseUnits(BIG_ONE.toString(), currencies[Field.OUTPUT].decimals);
      if (currencies[Field.OUTPUT].equals(usdToken[chainId])) {
        const usdPrice = new Price(
          currencies[Field.OUTPUT],
          usdToken[chainId],
          oneEther.toString(),
          oneEther.toString()
        );
        setQuotePrice(usdPrice);
      } else {
        const fetchData = async () => {
          const data = await quote(chainId, currencies[Field.OUTPUT], usdToken[chainId], oneEther);
          if (!data.statusCode) {
            const _price = new Price(
              currencies[Field.OUTPUT],
              usdToken[chainId],
              oneEther.toString(),
              data.toTokenAmount
            );
            setQuotePrice(_price);
          }
        };
        fetchData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.OUTPUT]]);

  useEffect(() => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      const fetchData = async () => {
        try {
          const baseTokenInfo = await getTokenInfo(chainId, currencies[Field.INPUT]);
          const tokenInfo = await getTokenInfo(chainId, currencies[Field.OUTPUT]);

          setBuyTax(tokenInfo?.BuyTax ?? 0);
          setSellTax(tokenInfo?.SellTax ?? 0);
          const totalTax =
            (Math.max(baseTokenInfo.BuyTax, baseTokenInfo.SellTax) + Math.max(tokenInfo.BuyTax, tokenInfo.SellTax)) *
            100;
          setSlippage(totalTax + (totalTax ? slippageWithTVL : slippageDefault));
        } catch (err) {
          console.error(err);
          setSlippage(slippageDefault);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT]]);

  useEffect(() => {
    if (currencies[Field.OUTPUT]) {
      const checkVerification = async () => {
        try {
          const verificationContract = getVerificationContract(chainId, library);
          const balance = await verificationContract.balanceOf(
            currencies[Field.OUTPUT].isNative ? WNATIVE[chainId].address : currencies[Field.OUTPUT].address
          );
          if (balance.toNumber()) {
            setVerified(true);
          } else {
            setVerified(false);
          }
        } catch (err) {
          console.error(err);
          setVerified(false);
        }
      };
      checkVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies[Field.OUTPUT]]);

  const pendingText = t("Exchanging %amountA% %symbolA% to %amountB% %symbolB%", {
    amountA: inputAmount?.toSignificant(6) ?? "",
    symbolA: currencies[Field.INPUT]?.symbol ?? "",
    amountB: outputAmount?.toSignificant(6) ?? "",
    symbolB: currencies[Field.OUTPUT]?.symbol ?? "",
  });

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency);
      onUserInput(Field.INPUT, "");
    },
    [onCurrencySelection, onUserInput]
  );
  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
    },
    [onCurrencySelection]
  );

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value);
    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(valueAsIntFromRoundedFloat);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async () => {
    setAttemptingTxn(true);
    try {
      await approveCallback();
    } catch (err: any) {
      if (err?.code === 4001) {
        toast.error(t("Transaction rejected."));
      } else {
        toast.error(t("Please try again. Confirm the transaction and make sure you are paying enough gas!"));
      }
    } finally {
      setAttemptingTxn(false);
    }
  };

  const showNotify = (type, tx) => {
    if (type === "confirming") {
      toast.success(
        <div className="toast__custom-layout">
          <div className="message">
            <span className="msg-text">Confirming Transaction</span>
          </div>
          <div className="link">
            <img src="/images/explorer/etherscan.png" alt="" />
            <a href={`${EXPLORER_URLS[chainId]}/tx/${tx?.hash}`} className="down-text">
              View Transaction Hash
            </a>
          </div>
        </div>,
        {
          className: "toast__background-primary",
          icon: ({ theme, type }) => <img src="/images/brewlabs-bubbling-seemless.gif" />,
          autoClose: 15000,
          closeButton: false,
          hideProgressBar: true,
        }
      );
    }

    if (type === "confirmed") {
      toast.success(
        <div className="toast__custom-layout">
          <div className="message">
            <span className="msg-text">Transaction Confirmed</span>
          </div>
          <div className="link">
            <img src="/images/explorer/etherscan.png" alt="" />
            <a href={`${EXPLORER_URLS[chainId]}/tx/${tx?.hash}`} className="down-text">
              View Transaction Hash
            </a>
          </div>
        </div>,
        {
          icon: false,
          className: "toast__background-primary",
          autoClose: 2000,
          closeButton: false,
        }
      );
    }
  }
  
  const handleSwap = async () => {
    setAttemptingTxn(true);
    try {
      if (!currencies[Field.INPUT].isNative) {
        const tokenContract = getBep20Contract(chainId, currencies[Field.INPUT].address, signer);
        const allowance = await tokenContract.allowance(account, aggregatorAddress);
        if (allowance.lt(parsedAmount)) {
          const tx = await tokenContract.approve(aggregatorAddress, MaxUint256);
          const receipt = await tx.wait();
          if (!receipt.status) console.error("Failed to approve token");
        }
      }

      const aggregatorContract = getBrewlabsAggregationRouterContract(chainId, signer);
      const treasuryFee = await aggregatorContract.treasuryFee();
      const strategyFeeNumerator = await aggregatorContract.strategyFeeNumerator();
      const strategyFeeDenominator = await aggregatorContract.strategyFeeDenominator();
      const strategyFee = parsedAmount.mul(strategyFeeNumerator).div(strategyFeeDenominator);

      const swapTransaction = await swap(
        chainId,
        currencies[Field.INPUT],
        currencies[Field.OUTPUT],
        parsedAmount.sub(strategyFee),
        account,
        autoMode ? slippage / 100 : userSlippageTolerance / 100
      );

      const txData = swapTransaction.tx;
      let estimatedGasLimit: BigNumber;
      let args: any[];
      let tx: TxResponse = null;
      const inter = new ethers.utils.Interface(AggregaionRouterV2Abi);
      const decodedInput = inter.parseTransaction({ data: txData.data, value: txData.value });
      const value = currencies[Field.INPUT].isNative ? parsedAmount.add(treasuryFee) : treasuryFee;

      if (decodedInput.name === "swap") {
        let callData = decodedInput.args.data.replace(addressWithout0x(AggregationRouterV5[chainId]), addressWithout0x(aggregatorAddress));
        args = [decodedInput.args.caller, decodedInput.args.desc, decodedInput.args.permit, callData, parsedAmount];

        estimatedGasLimit = await aggregatorContract.estimateGas.swapAggregateCall(...args, { value });
        tx = await aggregatorContract.swapAggregateCall(...args, {
          value,
          gasLimit: calculateTotalGas(estimatedGasLimit),
        });
      } else if (decodedInput.name === "unoswap") {
        args = [
          decodedInput.args.srcToken,
          currencies[Field.OUTPUT].address ?? ETHER_ADDRESS,
          parsedAmount,
          0,
          decodedInput.args.pools,
        ];

        estimatedGasLimit = await aggregatorContract.estimateGas.unoswapAggregateCall(...args, { value });
        tx = await aggregatorContract.unoswapAggregateCall(...args, {
          value,
          gasLimit: calculateTotalGas(estimatedGasLimit),
        });
      } else {
        args = [
          currencies[Field.INPUT].address ?? ETHER_ADDRESS,
          currencies[Field.OUTPUT].address ?? ETHER_ADDRESS,
          account,
          parsedAmount,
          0,
          decodedInput.args.pools,
        ];

        estimatedGasLimit = await aggregatorContract.estimateGas.uniswapV3SwapAggregateCall(...args, { value });
        tx = await aggregatorContract.uniswapV3SwapAggregateCall(...args, {
          value,
          gasLimit: calculateTotalGas(estimatedGasLimit),
        });
      }
      showNotify("confirming", tx);
      const receipt = await tx.wait();
      if (receipt?.status) {
        showNotify("confirmed", tx);
      }
    } catch (err: any) {
      if (err?.code === "ACTION_REJECTED") {
        toast.error(t("Transaction rejected."));
      } else {
        toast.error(t("Please try again. Confirm the transaction and make sure you are paying enough gas!"));
      }
    } finally {
      setAttemptingTxn(false);
      onUserInput(Field.INPUT, "");
    }
  };

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
    setTxHash("");
  }, [onUserInput, txHash]);

  const swapBoxLayoutId = "curreny-selection";

  return (
    <PageWrapper>
      {inputCurrencySelect || outputCurrencySelect ? (
        <>
          <div className="pt-20"></div>
          <CurrencySelect
            layoutId={swapBoxLayoutId}
            onCurrencySelect={inputCurrencySelect ? handleInputSelect : handleOutputSelect}
            onDismiss={() => (inputCurrencySelect ? setInputCurrencySelect(false) : setOutputCurrencySelect(false))}
            selectedCurrency={inputCurrencySelect ? currencies[Field.INPUT] : currencies[Field.OUTPUT]}
          />
        </>
      ) : (
        <>
          <PageHeader
            title={
              <>
                Exchange Tokens at the <WordHighlight content="best" /> rate on the market.
              </>
            }
            summary="Exchange Tokens at the best rate on the market."
          />
          <motion.div layoutId={swapBoxLayoutId}>
            <Container>
              <div className="mx-auto mb-4 flex flex-col gap-1" style={{ maxWidth: "500px" }}>
                <SubNav openSettingModal={() => setOpenSettingModal(true)} />
                <ChainSelect id={"chain-select"} />
                <CurrencyInputPanel
                  label={t("Sell")}
                  value={typedValue}
                  onUserInput={handleTypeInput}
                  onMax={() => onUserInput(Field.INPUT, maxAmounts?.toExact())}
                  onOpenCurrencySelect={() => setInputCurrencySelect(true)}
                  showMaxButton={!atMaxAmount}
                  currency={currencies[Field.INPUT]}
                  balance={currencyBalances[Field.INPUT]}
                />
                <SwitchIconButton
                  onSwitch={() => {
                    onSwitchTokens();
                    onUserInput(Field.INPUT, "");
                  }}
                />
                <CurrencyOutputPanel
                  label={t("Buy")}
                  value={outputAmount?.toSignificant(6) ?? "0.0"}
                  onUserInput={() => null}
                  onOpenCurrencySelect={() => setOutputCurrencySelect(true)}
                  currency={currencies[Field.OUTPUT]}
                  balance={currencyBalances[Field.OUTPUT]}
                  data={quoteData}
                  slippage={autoMode ? slippage : userSlippageTolerance}
                  price={price}
                  buyTax={buyTax}
                  sellTax={sellTax}
                  verified={verified}
                />
                {account &&
                  (Object.keys(contracts.aggregator).includes(chainId.toString()) ? (
                    <>
                      {inputError ? (
                        <Button disabled={true}>{t(inputError)}</Button>
                      ) : currencyBalances[Field.INPUT] === undefined ? (
                        <Button disabled={true}>{t("Loading")}</Button>
                      ) : approval <= ApprovalState.PENDING ? (
                        <PrimarySolidButton
                          onClick={() => {
                            handleApprove();
                          }}
                        >
                          {approval === ApprovalState.PENDING ? (
                            <span>{t("Approve %asset%", { asset: currencies[Field.INPUT]?.symbol })}</span>
                          ) : approval === ApprovalState.UNKNOWN ? (
                            <span>{t("Loading", { asset: currencies[Field.INPUT]?.symbol })}</span>
                          ) : (
                            t("Approve %asset%", { asset: currencies[Field.INPUT]?.symbol })
                          )}
                        </PrimarySolidButton>
                      ) : (
                        <PrimarySolidButton
                          onClick={() => {
                            handleSwap();
                          }}
                          disabled={attemptingTxn || !outputAmount}
                        >
                          {t("Swap")}
                        </PrimarySolidButton>
                      )}
                    </>
                  ) : (
                    <Button disabled={!0}>{t("Comming Soon")}</Button>
                  ))}
                <History />
              </div>
            </Container>
          </motion.div>
        </>
      )}
      {/* <ApproveModal
        open={approvalModalOpen}
        onApprove={approveCallback}
        onClose={() => {
          setApprovalModalOpen(false);
        }}
      /> */}
      <SettingModal
        open={openSettingModal}
        autoMode={autoMode}
        setAutoMode={setAutoMode}
        slippage={slippage}
        slippageInput={slippageInput}
        parseCustomSlippage={parseCustomSlippage}
        onClose={() => {
          setOpenSettingModal(false);
        }}
      />
    </PageWrapper>
  );
}

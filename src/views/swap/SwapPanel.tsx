import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { CurrencyAmount, Percent, Price, ChainId } from "@brewlabs/sdk";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

import { PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN, ALLOWED_PRICE_IMPACT_HIGH } from "config/constants";
import contracts from "config/constants/contracts";
import { useTranslation } from "contexts/localization";
import { SwapContext } from "contexts/SwapContext";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ApprovalState, useApproveCallbackFromTrade } from "hooks/useApproveCallback";
import { useSwapAggregator } from "@hooks/swap/useSwapAggregator";
import useSwapCallback from "@hooks/swap/useSwapCallback";
import useWrapCallback, { WrapType } from "@hooks/swap/useWrapCallback";
import { useUserSlippageTolerance, useUserTransactionTTL } from "state/user/hooks";
import { Field } from "state/swap/actions";
import { useSwapState, useSwapActionHandlers, useDerivedSwapInfo } from "state/swap/hooks";
import maxAmountSpend from "utils/maxAmountSpend";
import { computeTradePriceBreakdown, warningSeverity } from "utils/prices";

import CurrencyInputPanel from "components/currencyInputPanel";
import CurrencyOutputPanel from "components/currencyOutputPanel";
import { PrimarySolidButton } from "components/button/index";
import Button from "components/Button";
import WarningModal from "@components/warningModal";

import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";
import ConfirmationModal from "./components/modal/ConfirmationModal";
import StyledButton from "views/directory/StyledButton";
import { useSwitchNetwork } from "@hooks/useSwitchNetwork";
import { NETWORKS } from "config/constants/networks";
import { useTokenTaxes } from "@hooks/useTokenInfo";
import ConnectWallet from "@components/wallet/ConnectWallet";
import Modal from "@components/Modal";
import WalletSelector from "@components/wallet/WalletSelector";
import { useConnect } from "wagmi";
import { getViemClients } from "utils/viem";

export default function SwapPanel({
  showHistory = true,
  size,
  toChainId,
}: {
  showHistory?: boolean;
  size?: string;
  toChainId?: ChainId;
}) {
  const { account, chainId } = useActiveWeb3React();
  const { isLoading } = useConnect();
  const { canSwitch, switchNetwork } = useSwitchNetwork();

  const { t } = useTranslation();

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [txConfirmInfo, setTxConfirmInfo] = useState({ type: "confirming", tx: "" });
  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  const [openWalletModal, setOpenWalletModal] = useState(false);

  // ----------------- ROUTER SWAP --------------------- //

  const { autoMode, buyTax, sellTax, slippage, setAutoMode, setSlippageInput }: any = useContext(SwapContext);
  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const { currencies, currencyBalances, parsedAmount, inputError, v2Trade } = useDerivedSwapInfo();
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const { onUserInput, onSwitchTokens } = useSwapActionHandlers();

  // txn values
  const [deadline] = useUserTransactionTTL();
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();

  const noLiquidity = useMemo(() => {
    if (chainId === ChainId.BSC_TESTNET || chainId === ChainId.POLYGON)
      return currencies[Field.INPUT] && currencies[Field.OUTPUT] && !trade;
    return true; // use aggregator for non bsc testnet & polygon network
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], trade]);

  const [approval, approveCallback] = useApproveCallbackFromTrade(
    parsedAmount,
    trade,
    userSlippageTolerance,
    noLiquidity
  );

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);

  const { callback: swapCallbackUsingRouter, error: swapCallbackError }: any = useSwapCallback(
    trade,
    autoMode ? slippage : userSlippageTolerance,
    deadline,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const confirmPriceImpactWithoutFee = (priceImpactWithoutFee: Percent) => {
    if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
      return (
        window.prompt(
          `This swap has a price impact of at least ${PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(
            0
          )}%. Please type the word "confirm" to continue with this swap.`
        ) === "confirm"
      );
    }
    if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
      return window.confirm(
        `This swap has a price impact of at least ${ALLOWED_PRICE_IMPACT_HIGH.toFixed(
          0
        )}%. Please confirm that you would like to continue with this swap.`
      );
    }
    return true;
  };

  const handleApproveUsingRouter = async () => {
    try {
      const response = await approveCallback();
      const client = getViemClients({chainId});
      await client.waitForTransactionReceipt({hash: response})
    } catch (e) {}
  };

  const handleSwapUsingRouter = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallbackUsingRouter) {
      return;
    }
    setAttemptingTxn(true);
    swapCallbackUsingRouter()
      .then((hash) => {
        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      })
      .catch((error) => {
        if (error.reason) {
          toast.error(error.reason.split(":").slice(-1)[0]);
        } else if (error.message) {
          toast.error(error.message.split("(")[0]);
        }

        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      });
  }, [priceImpactWithoutFee, swapCallbackUsingRouter]);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);
  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [maxAmountInput, onUserInput]);

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
      if (value === "") onUserInput(Field.OUTPUT, "");
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // ----------------- AGGREGATION SWAP --------------------- //

  const {
    callback: swapCallbackUsingAggregator,
    query,
    error: aggregationCallbackError,
  } = useSwapAggregator(currencies, parsedAmount, autoMode ? slippage : userSlippageTolerance, deadline, recipient);

  const handleSwapUsingAggregator = async () => {
    if (!swapCallbackUsingAggregator) {
      return;
    }
    setAttemptingTxn(true);

    swapCallbackUsingAggregator()
      .then((hash) => {
        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      })
      .catch((error) => {
        if (error.reason) {
          if (error.reason == "BrewlabsAggregatonRouter: Insufficient output amount") {
            toast.error("Insufficient output amount, please check slippage.");
          } else toast.error(error.reason.split(":").slice(-1)[0]);
        } else if (error.message) {
          toast.error(error.message.split("(")[0]);
        }

        setAttemptingTxn(false);
        onUserInput(Field.INPUT, "");
      });
  };

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: noLiquidity
          ? parsedAmount
          : independentField === Field.INPUT
          ? parsedAmount
          : trade?.inputAmount,
        [Field.OUTPUT]: noLiquidity
          ? query?.outputAmount
          : independentField === Field.OUTPUT
          ? parsedAmount
          : trade?.outputAmount,
      };

  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const price = useMemo(() => {
    if (
      !parsedAmounts ||
      !parsedAmounts[Field.INPUT] ||
      !parsedAmounts[Field.OUTPUT] ||
      !currencies[Field.INPUT] ||
      !currencies[Field.OUTPUT] ||
      parsedAmounts[Field.INPUT].equalTo(0)
    )
      return undefined;
    return new Price(
      currencies[Field.INPUT],
      currencies[Field.OUTPUT],
      parsedAmounts[Field.INPUT].raw,
      parsedAmounts[Field.OUTPUT].raw
    );
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmounts[Field.INPUT]]);

  const onConfirm = () => {
    if (noLiquidity) {
      handleSwapUsingAggregator();
    } else {
      handleSwapUsingRouter();
    }
  };

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
  const { buyTaxes, sellTaxes }: any = useTokenTaxes(currencies[Field.OUTPUT]?.address, chainId);

  useEffect(() => {
    if (!buyTaxes) {
      setAutoMode(true);
    } else {
      setAutoMode(false);
      parseCustomSlippage(buyTaxes + 1);
    }
  }, [buyTaxes, currencies[Field.OUTPUT]?.address]);

  return (
    <>
      <Modal open={openWalletModal} onClose={() => !isLoading && setOpenWalletModal(false)} className="!z-[100]">
        <WalletSelector onDismiss={() => setOpenWalletModal(false)} />
      </Modal>
      <WarningModal open={warningOpen} setOpen={setWarningOpen} type={"highpriceimpact"} onClick={onConfirm} />
      <ConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        type={txConfirmInfo.type}
        tx={txConfirmInfo.tx}
      />

      <div className="rounded-2xl border border-gray-600">
        <CurrencyInputPanel
          label={t("Sell")}
          value={formattedAmounts[Field.INPUT]}
          onUserInput={handleTypeInput}
          onMax={handleMaxInput}
          showMaxButton={!atMaxAmountInput}
          currency={currencies[Field.INPUT]}
          balance={currencyBalances[Field.INPUT]}
          currencies={currencies}
          size={size}
        />
      </div>

      <SwitchIconButton
        onSwitch={() => {
          onSwitchTokens();
          onUserInput(Field.INPUT, "");
        }}
      />

      <div className="mb-6 rounded-2xl border border-dashed border-gray-600">
        <CurrencyOutputPanel
          label={t("Buy")}
          value={formattedAmounts[Field.OUTPUT]}
          onUserInput={handleTypeOutput}
          currency={currencies[Field.OUTPUT]}
          balance={currencyBalances[Field.OUTPUT]}
          data={parsedAmounts[Field.INPUT] && !showWrap ? query : undefined}
          slippage={autoMode ? slippage : userSlippageTolerance}
          price={price}
          buyTax={buyTax}
          sellTax={sellTax}
          currencies={currencies}
          noLiquidity={noLiquidity}
          size={size}
        />
      </div>
      {account ? (
        !(toChainId && toChainId !== chainId) ? (
          Object.keys(contracts.aggregator).includes(chainId.toString()) ? (
            <>
              {inputError ? (
                <button className="btn-outline btn" disabled={true}>
                  {t(inputError)}
                </button>
              ) : currencyBalances[Field.INPUT] === undefined ? (
                <button className="btn-outline btn" disabled={true}>
                  {t("Loading")}
                </button>
              ) : showWrap ? (
                <PrimarySolidButton disabled={Boolean(wrapInputError)} onClick={onWrap}>
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? "Wrap" : wrapType === WrapType.UNWRAP ? "Unwrap" : null)}
                </PrimarySolidButton>
              ) : approval <= ApprovalState.PENDING ? (
                <>
                  <PrimarySolidButton
                    onClick={() => {
                      handleApproveUsingRouter();
                    }}
                    pending={approval === ApprovalState.PENDING}
                    disabled={approval === ApprovalState.PENDING}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <span>{t("Approving %asset%", { asset: currencies[Field.INPUT]?.symbol })}</span>
                    ) : approval === ApprovalState.UNKNOWN ? (
                      <span>{t("Loading", { asset: currencies[Field.INPUT]?.symbol })}</span>
                    ) : (
                      t("Approve %asset%", { asset: currencies[Field.INPUT]?.symbol })
                    )}
                  </PrimarySolidButton>
                </>
              ) : (
                <PrimarySolidButton
                  onClick={() => {
                    if (priceImpactSeverity === 3) setWarningOpen(true);
                    else onConfirm();
                  }}
                  pending={attemptingTxn}
                  disabled={
                    attemptingTxn ||
                    (!noLiquidity && (!!swapCallbackError || priceImpactSeverity > 3)) ||
                    (noLiquidity && !!aggregationCallbackError)
                  }
                >
                  {attemptingTxn
                    ? "Swapping..."
                    : !noLiquidity
                    ? !!swapCallbackError
                      ? swapCallbackError
                      : priceImpactSeverity > 3
                      ? "Price Impact Too High"
                      : "Swap"
                    : !!aggregationCallbackError
                    ? aggregationCallbackError
                    : "Swap"}
                  {(attemptingTxn || aggregationCallbackError === "Querying swap path...") && (
                    <div className="absolute right-2 top-0 flex h-full items-center">
                      <Oval
                        width={21}
                        height={21}
                        color={"white"}
                        secondaryColor="black"
                        strokeWidth={3}
                        strokeWidthSecondary={3}
                      />
                    </div>
                  )}
                </PrimarySolidButton>
              )}
            </>
          ) : (
            <Button disabled={!0}>{t("Coming Soon")}</Button>
          )
        ) : (
          <StyledButton
            className="!w-full whitespace-nowrap p-[10px_12px] !font-roboto"
            onClick={() => {
              switchNetwork(toChainId);
            }}
            disabled={!canSwitch}
          >
            Switch {NETWORKS[toChainId].chainName}
          </StyledButton>
        )
      ) : (
        <StyledButton
          className="!w-full whitespace-nowrap p-[10px_12px] !font-roboto"
          onClick={() => {
            setOpenWalletModal(true);
          }}
          pending={isLoading}
        >
          Connect Wallet
        </StyledButton>
      )}

      {showHistory ? <History /> : ""}
    </>
  );
}

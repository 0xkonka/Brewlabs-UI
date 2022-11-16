import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";

import { bridgeConfigs } from "config/constants/bridge";
import { BridgeToken } from "config/constants/types";
import { useApproval } from "hooks/bridge/useApproval";
import { BridgeContextState, useBridgeContext } from "contexts/BridgeContext";
import { useBridgeDirection, useFromChainId } from "hooks/bridge/useBridgeDirection";
import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useTokenLimits } from "hooks/bridge/useTokenLimits";
import { useTokenPrices } from "hooks/useTokenPrice";
import { isRevertedError } from "lib/bridge/amb";
import { formatValue, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { fetchTokenBalance } from "lib/bridge/token";

import PageHeader from "../components/layout/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import CryptoCard from "../components/cards/CryptoCard";
import InputNumber from "../components/inputs/InputNumber";
import ChainSelector from "../components/ChainSelector";
import WordHighlight from "../components/text/WordHighlight";

import { useGlobalState, setGlobalState } from "../state";

import ConfirmBridgeMessage from "../components/bridge/ConfirmBridgeMessage";
import TransactionHistory from "../components/bridge/TransactionHistory";
import BridgeDragTrack from "../components/bridge/BridgeDragTrack";
import { useTheme } from "next-themes";

const useDelay = (fn: any, ms: number) => {
  const timer: any = useRef(0);

  const delayCallBack = useCallback(
    (...args: any) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(fn.bind(this, ...args), ms || 0);
    },
    [fn, ms]
  );

  return delayCallBack;
};

const percents = ["MAX", "10%", "25%", "50%", "75%"];

const Bridge: NextPage = () => {
  const { theme } = useTheme();
  const supportedNetworks = useSupportedNetworks();
  const fromChainId = useFromChainId();
  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();

  const [networkFrom, setNetworkFrom] = useGlobalState("userBridgeFrom");
  const [networkTo, setNetworkTo] = useGlobalState("userBridgeTo");
  // const [amount, setAmount] = useGlobalState("userBridgeAmount");
  const [locked, setLocked] = useGlobalState("userBridgeLocked");
  const [bridgeFromToken, setBridgeFromToken] = useGlobalState("userBridgeFromToken");
  const [locking, setLocking] = useState(false);
  const [returnAmount, setReturnAmount] = useState(0.0);

  const [supportedFromTokens, setSupportedFromTokens] = useState<BridgeToken[]>([]);
  const [bridgeToToken, setBridgeToToken] = useState<BridgeToken>();
  const [toChains, setToChains] = useState<ChainId[]>();
  const [percent, setPercent] = useState(0);

  const [openFromChainModal, setOpenFromChainModal] = useState(false);

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [toBalanceLoading, setToBalanceLoading] = useState(true);

  const { homeChainId, foreignChainId, getBridgeChainId, getTotalConfirms } = useBridgeDirection();
  const {
    txHash,
    fromToken,
    fromBalance,
    fromAmount,
    setFromBalance,
    setAmount,
    amountInput,
    setAmountInput,

    receiver,
    toToken,
    toBalance,
    toAmount,
    toAmountLoading,
    setToBalance,

    loading,
    transfer,
  }: BridgeContextState = useBridgeContext();
  const tokenPrices = useTokenPrices();
  const { tokenLimits } = useTokenLimits();
  const { allowed, approve, unlockLoading } = useApproval(fromToken!, fromAmount, txHash!);

  useEffect(() => {
    const tmpTokens = [];
    tmpTokens.push(...bridgeConfigs.filter((c) => c.homeChainId === fromChainId).map((config) => config.homeToken));
    tmpTokens.push(
      ...bridgeConfigs.filter((c) => c.foreignChainId === fromChainId).map((config) => config.foreignToken)
    );
    tmpTokens.sort((a, b) => {
      if (a.name > b.symbol) return -1;
      if (a.symbol < b.symbol) return 1;
      return 0;
    });

    setNetworkFrom(fromChainId);
    setSupportedFromTokens(tmpTokens);
  }, [fromChainId, setNetworkFrom]);

  useEffect(() => {
    if (bridgeFromToken?.chainId !== fromChainId) {
      setBridgeFromToken(supportedFromTokens[0]);
    }
  }, [fromChainId, bridgeFromToken, supportedFromTokens, setBridgeFromToken]);

  useEffect(() => {
    const chainIds = bridgeConfigs
      .filter((c) => c.homeChainId === fromChainId && c.homeToken.address === bridgeFromToken?.address)
      .map((config) => config.foreignChainId);
    chainIds.push(
      ...bridgeConfigs
        .filter((c) => c.foreignChainId === fromChainId && c.foreignToken.address === bridgeFromToken?.address)
        .map((config) => config.homeChainId)
    );
    setToChains(chainIds);
    if (chainIds.length === 0) {
      setBridgeToToken(undefined);
      return;
    }
    // set toChain
    let _toChainId = +networkTo;
    if (!chainIds.includes(+networkTo)) {
      _toChainId = chainIds[0];
      setNetworkTo(chainIds[0]);
    }

    // set toToken
    const config = bridgeConfigs.find(
      (c) =>
        (c.homeChainId === fromChainId &&
          c.homeToken.address === bridgeFromToken?.address &&
          c.foreignChainId === _toChainId) ||
        (c.foreignChainId === fromChainId &&
          c.foreignToken.address === bridgeFromToken?.address &&
          c.homeChainId === _toChainId)
    );
    if (config?.homeToken.address === bridgeFromToken?.address) {
      setBridgeToToken(config?.foreignToken);
    } else {
      setBridgeToToken(config?.homeToken);
    }
  }, [fromChainId, bridgeFromToken, setNetworkTo]);

  useEffect(() => {
    if (locked) {
      return;
    }

    if (locking) {
      const timer = setTimeout(() => {
        setLocked(true);
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (!locking) {
      setLocked(false);
    }
  }, [locked, setLocked, locking]);

  useEffect(() => {
    if (fromToken && account) {
      (async () => {
        try {
          setBalanceLoading(true);
          const b = await fetchTokenBalance(fromToken, account);
          setFromBalance(b);
        } catch (fromBalanceError) {
          setFromBalance(BigNumber.from(0));
          console.error({ fromBalanceError });
        } finally {
          setBalanceLoading(false);
        }
      })();
    } else {
      setFromBalance(BigNumber.from(0));
    }
  }, [txHash, fromToken, account, setFromBalance, setBalanceLoading]);

  useEffect(() => {
    if (toToken && account) {
      (async () => {
        try {
          setToBalanceLoading(true);
          const b = await fetchTokenBalance(toToken, account);
          setToBalance(b);
        } catch (toBalanceError) {
          setToBalance(BigNumber.from(0));
          console.error({ toBalanceError });
        } finally {
          setToBalanceLoading(false);
        }
      })();
    } else {
      setToBalance(BigNumber.from(0));
    }
  }, [txHash, toToken, account, setToBalance, setToBalanceLoading]);

  const updateAmount = useCallback(() => setAmount(amountInput), [amountInput, setAmount]);
  const delayedSetAmount = useDelay(updateAmount, 500);
  const showError = useCallback((msg: any) => {
    if (msg) toast.error(msg);
  }, []);

  const fromTokenSelected = (e: any) => {
    setBridgeFromToken(supportedFromTokens.find((token) => token.address === e.target.value));
  };

  const unlockButtonDisabled =
    !fromToken || allowed || toAmountLoading || !(isConnected && chain?.id === fromToken?.chainId);

  const transferButtonEnabled =
    !!fromToken && allowed && !loading && !toAmountLoading && isConnected && chain?.id === fromToken?.chainId;

  const onPercentSelected = (index: number) => {
    const realPercentages = [100, 10, 25, 50, 75]
    if (fromBalance && fromToken) {
      setAmountInput(ethers.utils.formatUnits(fromBalance.mul(realPercentages[index]).div(100), fromToken.decimals).toString());
      setAmount(ethers.utils.formatUnits(fromBalance.mul(realPercentages[index]).div(100), fromToken.decimals).toString());
    }
    setPercent(index);
  };

  const approveValid = useCallback(() => {
    if (!chain?.id) {
      showError("Please connect wallet");
      return false;
    }
    if (chain?.id !== fromToken?.chainId) {
      showError(`Please switch to ${getNetworkLabel(fromToken?.chainId!)}`);
      return false;
    }
    if (fromAmount.lte(0)) {
      showError("Please specify amount");
      return false;
    }
    if (fromBalance.lt(fromAmount)) {
      showError("Not enough balance");
      return false;
    }
    return true;
  }, [chain, fromToken?.chainId, fromAmount, fromBalance, showError]);

  const onApprove = useCallback(() => {
    if (!unlockLoading && !unlockButtonDisabled && approveValid()) {
      approve().catch((error) => {
        console.log(error);
        if (error && error.message) {
          if (
            isRevertedError(error) ||
            (error.data && (error.data.includes("Bad instruction fe") || error.data.includes("Reverted")))
          ) {
            showError(
              <div>
                There is problem with the token unlock. Try to revoke previous approval if any on{" "}
                <a href="https://revoke.cash" className="text-underline">
                  https://revoke.cash/
                </a>{" "}
                and try again.
              </div>
            );
          } else {
            handleWalletError(error, showError);
          }
        } else {
          showError("Impossible to perform the operation. Reload the application and try again.");
        }
      });
    }
  }, [unlockLoading, unlockButtonDisabled, approveValid, showError, approve]);

  const transferValid = useCallback(() => {
    if (!chain?.id) {
      showError("Please connect wallet");
    } else if (chain?.id !== fromToken?.chainId) {
      showError(`Please switch to ${getNetworkLabel(fromToken?.chainId!)}`);
    } else if (
      tokenLimits &&
      (fromAmount.gt(tokenLimits.remainingLimit) || tokenLimits.remainingLimit.lt(tokenLimits.minPerTx))
    ) {
      showError("Daily limit reached. Please try again tomorrow or with a lower amount");
    } else if (tokenLimits && fromAmount.lt(tokenLimits.minPerTx)) {
      showError(`Please specify amount more than ${formatValue(tokenLimits.minPerTx, fromToken.decimals)}`);
    } else if (tokenLimits && fromAmount.gt(tokenLimits.maxPerTx)) {
      showError(`Please specify amount less than ${formatValue(tokenLimits.maxPerTx, fromToken.decimals)}`);
    } else if (fromBalance.lt(fromAmount)) {
      showError("Not enough balance");
    } else if (receiver && !ethers.utils.isAddress(receiver)) {
      showError(`Please specify a valid recipient address`);
    } else {
      return true;
    }
    return false;
  }, [chain, tokenLimits, fromToken, fromAmount, fromBalance, receiver, showError]);

  const onTransfer = useCallback(() => {
    if (transferButtonEnabled && transferValid()) {
      transfer().catch((error: any) => handleWalletError(error, showError));
    }
  }, [transferButtonEnabled, transferValid, transfer]);

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Send funds <WordHighlight content="cross-chain" /> with our bridge.
          </>
        }
        summary="Easily transfer tokens with confidence."
      />

      <Container>
        <div className="relative sm:grid sm:grid-cols-11 sm:items-center">
          <CryptoCard
            title="Bridge from"
            id="bridge_card_from"
            tokenPrice={tokenPrices[`c${bridgeFromToken?.chainId}_t${bridgeFromToken?.address?.toLowerCase()}`] ?? 0}
            modal={{
              buttonText: getNetworkLabel(+networkFrom),
              disableAutoCloseOnClick: true,
              openModal: openFromChainModal,
              onOpen: () => setOpenFromChainModal(true),
              onClose: () => setOpenFromChainModal(false),
              modalContent: (
                <ChainSelector
                  bSwitchChain
                  networks={supportedNetworks}
                  currentChainId={networkFrom}
                  onDismiss={() => setOpenFromChainModal(false)}
                  selectFn={(selectedValue) => setGlobalState("userBridgeFrom", +selectedValue)}
                />
              ),
            }}
          >
            <div className="mx-auto mt-4 max-w-md">
              <div className="flex items-center justify-between">
                <label htmlFor="price" className="text-sm font-medium text-gray-400">
                  Token and Amount
                </label>
                {balanceLoading ? (
                  <Skeleton
                    width={80}
                    baseColor={theme === "dark" ? "#3e3e3e" : "#bac3cf"}
                    highlightColor={theme === "dark" ? "#686363" : "#747c87"}
                  />
                ) : (
                  <label className="text-sm font-medium text-gray-400">
                    {formatValue(fromBalance, fromToken?.decimals)}
                  </label>
                )}
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={fromToken?.address}
                    onChange={fromTokenSelected}
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-amber-300 focus:ring-amber-300 sm:text-sm"
                  >
                    {supportedFromTokens.map((token) => (
                      <option key={`${token.chainId}-${token.address}`} value={token.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <InputNumber
                  name="bridge_amount"
                  placeholder={"0.0"}
                  value={amountInput}
                  onKeyPress={(e: any) => {
                    if (e.key === ".") {
                      if (e.target.value.includes(".")) {
                        e.preventDefault();
                      }
                    } else if (Number.isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                  onKeyUp={delayedSetAmount}
                  onChange={(event) => {
                    setPercent(0);
                    setAmountInput(event.target.value);
                  }}
                />

                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={percent}
                    onChange={(e) => onPercentSelected(+e.target.value)}
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-amber-300 focus:ring-amber-300 sm:text-sm"
                  >
                    {percents.map((val, idx) => (
                      <option key={idx} value={idx}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CryptoCard>

          <BridgeDragTrack setLockingFn={setLocking} />

          <CryptoCard
            title="Bridge to"
            id="bridge_card_to"
            tokenPrice={tokenPrices[`c${bridgeToToken?.chainId}_t${bridgeToToken?.address?.toLowerCase()}`] ?? 0}
            active={locking}
            modal={{
              buttonText: getNetworkLabel(+networkTo),
              onClose: () => setLocking(false),
              openModal: locked,
              modalContent: locked ? (
                <ConfirmBridgeMessage />
              ) : (
                <ChainSelector
                  networks={supportedNetworks.filter((n) => toChains?.includes(n.id))}
                  currentChainId={networkTo}
                  selectFn={(selectedValue) => setGlobalState("userBridgeTo", +selectedValue)}
                />
              ),
            }}
          >
            <div className="mt-8">
              <div className="flex justify-center text-2xl text-slate-400">
                {toAmountLoading ? (
                  <Skeleton
                    width={100}
                    baseColor={theme === "dark" ? "#3e3e3e" : "#bac3cf"}
                    highlightColor={theme === "dark" ? "#686363" : "#747c87"}
                  />
                ) : (
                  <span>{formatValue(toAmount, bridgeToToken?.decimals)}</span>
                )}
                <span className="ml-1"> {bridgeToToken?.symbol}</span>
              </div>
            </div>
          </CryptoCard>
        </div>

        <TransactionHistory />
      </Container>
    </PageWrapper>
  );
};

export default Bridge;

import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import { parseUnits, zeroAddress } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { BridgeToken } from "config/constants/types";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useBridgeDirection } from "hooks/bridge/useBridgeDirection";
import { useMediatorInfo } from "hooks/bridge/useMediatorInfo";
import { fetchToAmount, fetchToToken, relayTokens } from "lib/bridge/bridge";
import { fetchTokenDetails } from "lib/bridge/token";
import { getNetworkLabel } from "lib/bridge/helpers";

export interface BridgeContextState {
  amountInput: string;
  setAmountInput: React.Dispatch<React.SetStateAction<string>>;
  fromAmount: bigint;
  toAmount: bigint;
  toAmountLoading: boolean;
  setAmount: (inputAmount: string) => Promise<void>;
  fromBalance: bigint;
  setFromBalance: React.Dispatch<React.SetStateAction<bigint>>;
  toBalance: bigint;
  setToBalance: React.Dispatch<React.SetStateAction<bigint>>;
  // tokens
  fromToken: BridgeToken | null;
  toToken: BridgeToken | null;
  setToToken: (newToToken: BridgeToken) => void;
  setToken: (tokenWithoutMode: BridgeToken, isQueryToken?: boolean) => void;
  switchTokens: () => void;
  // bridge
  transfer: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  txHash: string | undefined;
  setTxHash: React.Dispatch<React.SetStateAction<string | undefined>>;
  // misc
  receiver: string | undefined;
  setReceiver: React.Dispatch<React.SetStateAction<string | undefined>>;
  shouldReceiveNativeCur: boolean;
  setShouldReceiveNativeCur: React.Dispatch<React.SetStateAction<boolean>>;
  currentDay: number | undefined;
}

const emptyHandler = async () => {};
export const BridgeContext = React.createContext<BridgeContextState>({
  amountInput: "",
  setAmountInput: () => "",
  fromAmount: BigInt(0),
  toAmount: BigInt(0),
  toAmountLoading: false,
  setAmount: emptyHandler,
  fromBalance: BigInt(0),
  setFromBalance: () => BigInt(0),
  toBalance: BigInt(0),
  setToBalance: () => BigInt(0),
  // tokens
  fromToken: null,
  toToken: null,
  setToToken: emptyHandler,
  setToken: emptyHandler,
  switchTokens: emptyHandler,
  // bridge
  transfer: emptyHandler,
  loading: true,
  setLoading: () => false,
  txHash: undefined,
  setTxHash: () => undefined,
  // misc
  receiver: undefined,
  setReceiver: () => undefined,
  shouldReceiveNativeCur: false,
  setShouldReceiveNativeCur: () => false,
  currentDay: undefined,
});
export const useBridgeContext = () => useContext(BridgeContext);

export const BridgeProvider: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { address: account, isConnected } = useAccount();
  const { chainId: providerChainId } = useActiveChainId();
  const { data: walletClient } = useWalletClient();

  const {
    bridgeDirectionId,
    version,
    getBridgeChainId,
    homeChainId,
    foreignChainId,
    homeToken,
    foreignToken,
    foreignPerformanceFee,
    homePerformanceFee,
    mediatorData,
  } = useBridgeDirection();

  const [receiver, setReceiver] = useState<string>();
  const [amountInput, setAmountInput] = useState("");
  const [{ fromToken, toToken }, setTokens] = useState<{ fromToken: BridgeToken | null; toToken: BridgeToken | null }>({
    fromToken: null,
    toToken: null,
  });
  const [{ fromAmount, toAmount }, setAmounts] = useState({
    fromAmount: BigInt(0),
    toAmount: BigInt(0),
  });
  const [toAmountLoading, setToAmountLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldReceiveNativeCur, setShouldReceiveNativeCur] = useState(false);
  const [fromBalance, setFromBalance] = useState(BigInt(0));
  const [toBalance, setToBalance] = useState(BigInt(0));
  const [txHash, setTxHash] = useState<string>();

  // const {
  //   homeFeeManagerAddress,
  //   foreignFeeManagerAddress,
  //   isRewardAddress,
  //   homeToForeignFeeType,
  //   foreignToHomeFeeType,
  //   currentDay,
  // } = useMediatorInfo();

  const {
    feeManager: homeFeeManagerAddress,
    homeToForeignFeeType,
    foreignToHomeFeeType,
    currentDay,
    rewarderList,
  } = mediatorData[homeChainId] ?? {};
  const { feeManager: foreignFeeManagerAddress } = mediatorData[foreignChainId] ?? {};

  const isRewardAddress = rewarderList?.includes(account);

  const isHome = providerChainId === homeChainId;
  const feeType = isHome ? homeToForeignFeeType : foreignToHomeFeeType;

  const getToAmount = useCallback(
    async (amount: bigint) =>
      isRewardAddress
        ? amount
        : fetchToAmount(
            bridgeDirectionId,
            feeType,
            fromToken,
            toToken,
            amount,
            (isHome ? homeFeeManagerAddress : foreignFeeManagerAddress) ?? ""
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bridgeDirectionId, fromToken, toToken, isRewardAddress, homeFeeManagerAddress, foreignFeeManagerAddress, feeType]
  );

  const cleanAmounts = useCallback(() => {
    setAmountInput("");
    setAmounts({
      fromAmount: BigInt(0),
      toAmount: BigInt(0),
    });
  }, []);

  const setAmount = useCallback(
    async (inputAmount: string) => {
      if (!fromToken || !toToken) return;
      setToAmountLoading(true);
      const amount = parseUnits(inputAmount === "" ? "0" : inputAmount, fromToken.decimals);
      const gotToAmount = await getToAmount(amount);
      const toTokenDecimals = fromToken.chainId === homeChainId ? foreignToken.decimals : homeToken.decimals;
      setAmounts({
        fromAmount: amount,
        toAmount: (gotToAmount * BigInt(10 ** (36 - fromToken.decimals))) / BigInt(10 ** (36 - toTokenDecimals)),
      });
      setToAmountLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fromToken, toToken, getToAmount]
  );

  const setToToken = useCallback(
    (newToToken: BridgeToken) => {
      setTokens((prevTokens) => ({
        fromToken: prevTokens.fromToken,
        toToken: { ...newToToken },
      }));
    },
    [setTokens]
  );

  useEffect(() => {
    if (
      fromToken &&
      toToken &&
      fromToken.chainId &&
      toToken.chainId &&
      [homeChainId, foreignChainId].includes(fromToken.chainId) &&
      [homeChainId, foreignChainId].includes(toToken.chainId) &&
      (fromToken.address !== zeroAddress || fromToken.mode === "NATIVE")
    ) {
      const label = getNetworkLabel(fromToken.chainId).toUpperCase();
      const storageKey = `${label}-FROM-TOKEN`;
      localStorage.setItem(storageKey, JSON.stringify(fromToken));
    }
  }, [fromToken, toToken, homeChainId, foreignChainId]);

  const setToken = useCallback(
    async (tokenWithoutMode: BridgeToken, isQueryToken = false) => {
      if (!tokenWithoutMode) return false;
      try {
        // const [token, gotToToken] = await Promise.all([
        //   fetchTokenDetails(bridgeDirectionId, tokenWithoutMode),
        //   fetchToToken(bridgeDirectionId, tokenWithoutMode, getBridgeChainId(tokenWithoutMode.chainId)),
        // ]);

        let token = {...tokenWithoutMode, mode: undefined};
        let gotToToken = {...mediatorData[tokenWithoutMode.chainId].bridgedToken, mode: undefined};
        console
        if (mediatorData[token.chainId].isNative) {
          token.mode = "erc20";
          gotToToken.mode = "erc677";
        } else {
          token.mode = "erc677";
          gotToToken.mode = "erc20";
        }

        setTokens({
          fromToken: token,
          toToken: {
            ...token,
            ...gotToToken,
          },
        });
        return true;
      } catch (tokenDetailsError) {
        // toast.error(
        //   !isQueryToken
        //     ? "Cannot fetch token details. Wait for a few minutes and reload the application"
        //     : "Token not found."
        // );
        console.error({ tokenDetailsError });
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getBridgeChainId]
  );

  const transfer = useCallback(async () => {
    if (!receiver && !account) {
      throw new Error("Must set receiver");
    }
    if (!walletClient || !fromToken) return;

    try {
      setLoading(true);
      setTxHash(undefined);

      const tx = await relayTokens(
        walletClient,
        fromToken,
        (receiver ?? account)!,
        fromAmount,
        version,
        fromToken.chainId === foreignChainId ? foreignPerformanceFee : homePerformanceFee
      );
      setTxHash(tx);
      setAmountInput("0");
      setAmount("0");
    } catch (transferError) {
      setLoading(false);
      console.error({
        transferError,
        fromToken,
        receiver: receiver || account,
        fromAmount: fromAmount.toString(),
        account,
      });
      throw transferError;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fromToken,
    toToken,
    account,
    receiver,
    walletClient,
    fromAmount,
    setAmount,
    shouldReceiveNativeCur,
    foreignChainId,
  ]);

  const switchTokens = useCallback(() => {
    setTokens(({ fromToken: from, toToken: to }) => ({
      fromToken: to,
      toToken: from,
    }));
    cleanAmounts();
  }, [cleanAmounts]);

  useEffect(() => {
    if (
      fromToken &&
      toToken &&
      fromToken.chainId &&
      toToken.chainId &&
      [homeChainId, foreignChainId].includes(fromToken.chainId) &&
      [homeChainId, foreignChainId].includes(toToken.chainId) &&
      providerChainId === toToken.chainId
    ) {
      switchTokens();
    }
  }, [homeChainId, foreignChainId, providerChainId, fromToken, toToken, switchTokens]);

  const setDefaultToken = useCallback(
    async (chainId: ChainId, force = false) => {
      const token = chainId === homeChainId ? homeToken : foreignToken;
      if (force || !fromToken || (token?.chainId !== fromToken?.chainId && token?.address !== fromToken?.address)) {
        await setToken(token);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setToken, fromToken, bridgeDirectionId]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      let tokenSet = false;

      const tokensValid =
        fromToken &&
        toToken &&
        [homeChainId, foreignChainId].includes(fromToken?.chainId) &&
        [homeChainId, foreignChainId].includes(toToken?.chainId);

      const chainId = [homeChainId, foreignChainId].includes(providerChainId) ? providerChainId : foreignChainId;

      if ((isConnected || !account) && !tokenSet && !tokensValid) {
        await setDefaultToken(chainId, !tokensValid);
      }
      cleanAmounts();
      setLoading(false);
    })();
  }, [
    setDefaultToken,
    setToken,
    fromToken,
    toToken,
    bridgeDirectionId,
    homeChainId,
    foreignChainId,
    providerChainId,
    account,
    isConnected,
    cleanAmounts,
  ]);

  useEffect(() => {
    if (toToken?.chainId === foreignChainId && toToken?.address === zeroAddress && toToken?.mode === "NATIVE") {
      setShouldReceiveNativeCur(true);
    } else {
      setShouldReceiveNativeCur(false);
    }
  }, [fromToken, toToken, foreignChainId]);

  const bridgeContext = useMemo(
    () => ({
      // amounts & balances
      amountInput,
      setAmountInput,
      fromAmount,
      toAmount,
      toAmountLoading,
      setAmount,
      fromBalance,
      setFromBalance,
      toBalance,
      setToBalance,
      // tokens
      fromToken,
      toToken,
      setToToken,
      setToken,
      switchTokens,
      // bridge
      transfer,
      loading,
      setLoading,
      txHash,
      setTxHash,
      // misc
      receiver,
      setReceiver,
      shouldReceiveNativeCur,
      setShouldReceiveNativeCur,
      currentDay,
    }),
    [
      // amounts & balances
      amountInput,
      setAmountInput,
      fromAmount,
      toAmount,
      toAmountLoading,
      setAmount,
      fromBalance,
      setFromBalance,
      toBalance,
      setToBalance,
      // tokens
      fromToken,
      toToken,
      setToToken,
      setToken,
      switchTokens,
      // bridge
      transfer,
      loading,
      setLoading,
      txHash,
      setTxHash,
      // misc
      receiver,
      setReceiver,
      shouldReceiveNativeCur,
      setShouldReceiveNativeCur,
      currentDay,
    ]
  );

  return <BridgeContext.Provider value={bridgeContext}>{children}</BridgeContext.Provider>;
};

import { CurrencyAmount, Price } from "@brewlabs/sdk";
import { BigNumber } from "ethers";
import React, { useState } from "react";
import { useDefaultsFromURLSearch } from "state/swap/hooks";

const SwapContext: any = React.createContext({
  quoteData: {},
  outputAmount: "",
  slippageInput: "",
  autoMode: true,
  basePrice: "",
  quotePrice: "",
  onTyping: false,
  parsedAmount: "",
  buyTax: 0,
  sellTax: 0,
  slippage: 50,
  verified: false,
  apporveStep: 0,
  viewType: 0,
  setQuoteData: () => {},
  setOutputAmount: () => {},
  setSlippageInput: () => {},
  setAutoMode: () => {},
  setBasePrice: () => {},
  setQuotePrice: () => {},
  setTyping: () => {},
  setParsedAmount: () => {},
  setBuyTax: () => {},
  setSellTax: () => {},
  setSlippage: () => {},
  setVerified: () => {},
  setApproveStep: () => {},
  setViewType: () => {},
});

const SwapContextProvider = ({ children }: any) => {
  const [quoteData, setQuoteData] = useState({});
  const [outputAmount, setOutputAmount] = useState<CurrencyAmount>();
  const [slippageInput, setSlippageInput] = useState("");
  const [autoMode, setAutoMode] = useState(true);
  const [basePrice, setBasePrice] = useState<Price>();
  const [quotePrice, setQuotePrice] = useState<Price>();
  const [onTyping, setTyping] = useState(false);
  const [parsedAmount, setParsedAmount] = useState<BigNumber>();
  const [buyTax, setBuyTax] = useState(0);
  const [sellTax, setSellTax] = useState(0);
  const [slippage, setSlippage] = useState(50);
  const [verified, setVerified] = useState(false);
  const [apporveStep, setApproveStep] = useState(0);

  const [viewType, setViewType] = useState(0);

  useDefaultsFromURLSearch();

  return (
    <SwapContext.Provider
      value={{
        quoteData,
        outputAmount,
        slippageInput,
        autoMode,
        basePrice,
        quotePrice,
        onTyping,
        parsedAmount,
        buyTax,
        sellTax,
        slippage,
        verified,
        apporveStep,
        viewType,
        setQuoteData,
        setOutputAmount,
        setSlippageInput,
        setAutoMode,
        setBasePrice,
        setQuotePrice,
        setTyping,
        setParsedAmount,
        setBuyTax,
        setSellTax,
        setSlippage,
        setVerified,
        setApproveStep,
        setViewType,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export { SwapContext, SwapContextProvider };

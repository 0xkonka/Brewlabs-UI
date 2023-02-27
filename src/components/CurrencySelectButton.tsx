import CurrencySelector from "./CurrencySelector";
import { CurrencyLogo } from "./logo";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useGlobalState } from "state";
import { Field } from "state/swap/actions";
import { useDerivedSwapInfo } from "state/swap/hooks";
import { useEffect, useState } from "react";

const CurrencySelectButton = ({ inputCurrencySelect }: { inputCurrencySelect: boolean }) => {
  const { currencies } = useDerivedSwapInfo();
  const [inputValue, setInputValue] = useState(null);
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");

  useEffect(() => {
    setInputValue(inputCurrencySelect ? currencies[Field.INPUT] : currencies[Field.OUTPUT]);
  }, [currencies, inputCurrencySelect]);

  return (
    <button
      onClick={() => {
        setIsOpen(isOpen === 1 ? 1 : 2);
        setSidebarContent(
          <CurrencySelector inputType={inputCurrencySelect ? "input" : "output"} selectedCurrency={inputValue} />
        );
      }}
      className="btn font-brand font-light"
    >
      {inputValue ? (
        <span className="flex items-center justify-between gap-2 pr-8 text-2xl xsm:pr-1">
          <CurrencyLogo currency={inputValue} size="24px" />
          {inputValue?.symbol}
        </span>
      ) : (
        <span>Select Token</span>
      )}
      <ChevronDownIcon className="ml-2 mb-1 hidden h-5 w-5 dark:text-primary xsm:block" />
    </button>
  );
};

export default CurrencySelectButton;

import { Currency } from "@brewlabs/sdk";
import CurrencySelector from "./CurrencySelector";
import { CurrencyLogo } from "./logo";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useGlobalState } from "state";

const CurrencySelectButton = ({ currency, onCurrencySelect }: { currency: Currency, onCurrencySelect?: (currency: Currency) => void; }) => {
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");

  return (
    <button
      onClick={() => {
        setIsOpen(isOpen === 1 ? 1 : 2);
        setSidebarContent(
          <CurrencySelector selectedCurrency={currency} onCurrencySelect={onCurrencySelect} />
        );
      }}
      className="btn font-brand font-light"
    >
      {currency ? (
        <span className="flex items-center justify-between gap-2 pr-8 text-2xl xsm:pr-1">
          <CurrencyLogo currency={currency} size="24px" />
          {currency?.symbol}
        </span>
      ) : (
        <span>Select Token</span>
      )}
      <ChevronDownIcon className="ml-2 mb-1 hidden h-5 w-5 dark:text-primary xsm:block" />
    </button>
  );
};

export default CurrencySelectButton;

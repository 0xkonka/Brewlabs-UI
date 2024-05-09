import { forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import getTokenLogoURL from "utils/getTokenLogoURL";
import { mustBeConnected } from "utils/mustBeConnected";
import { setUserSidebarOpen, setUserSidebarContent } from "state";

import { Button } from "@components/ui/button";
import TokenLogo from "components/logo/TokenLogo";
import CurrencySelectorWrapper from "components/currency-selector/currency-selector-token-wrapper";

import type { Token } from "config/schemas/tokenSchema";
import type { SupportedToken } from "config/constants/bond-tokens";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedCurrency: Token;
  supportedDisabled?: boolean;
  supportedTokens?: SupportedToken[];
  activeTab?: "wallet" | "supported";
  setSelectCurrency: (currency, tokenPrice?: number) => void;
}

const CurrencySelectorTokenInput = forwardRef<HTMLInputElement, InputProps>(
  ({ selectedCurrency, setSelectCurrency, supportedTokens, supportedDisabled = false, activeTab, ...props }, ref) => {
    const currencyPanel = (
      <CurrencySelectorWrapper
        activeTab={activeTab}
        supportedTokens={supportedTokens}
        supportedDisabled={supportedDisabled}
        onCurrencySelect={(currency, tokenPrice) => setSelectCurrency(currency, tokenPrice)}
      />
    );

    return (
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-3xl px-4"
        onClick={() => mustBeConnected([() => setUserSidebarOpen(true), () => setUserSidebarContent(currencyPanel)])}
      >
        {selectedCurrency ? (
          <div className="flex flex-1 items-center gap-4 text-ellipsis whitespace-nowrap">
            <TokenLogo
              src={getTokenLogoURL(selectedCurrency.address, selectedCurrency.chainId, selectedCurrency.logo)}
              classNames="h-6 w-6"
            />

            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-200">
              {selectedCurrency.symbol}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">Select a token...</span>
        )}

        <ChevronDownIcon className="ml-auto h-5 w-5 dark:text-brand" />
      </Button>
    );
  }
);

CurrencySelectorTokenInput.displayName = "CurrencySelectorTokenInput";

export { CurrencySelectorTokenInput };

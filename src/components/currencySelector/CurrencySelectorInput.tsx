import { forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { setUserSidebarOpen, setUserSidebarContent } from "state";

import getTokenLogoURL from "utils/getTokenLogoURL";
import { mustBeConnected } from "utils/mustBeConnected";

import { Button } from "@components/ui/button";

import TokenLogo from "components/logo/TokenLogo";

import CurrencySelectorNFTs from "components/currencySelector/currency-selector-nfts";
import CurrencySelectorTokens from "@components/currencySelector/currency-selector-tokens";

// TODO: type this
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedCurrency: any;
  supportedTokens?: any[];
  walletTokenType?: "token" | "nft";
  setSelectCurrency: (currency, tokenPrice) => void;
}

const CurrencySelectorInput = forwardRef<HTMLInputElement, InputProps>(
  ({ selectedCurrency, setSelectCurrency, supportedTokens, walletTokenType = "token", ...props }, ref) => {
    // Determine the currency panel to display
    const currencyPanel =
      walletTokenType === "token" ? (
        <CurrencySelectorTokens
          supportedTokens={supportedTokens}
          onCurrencySelect={(currency, tokenPrice) => setSelectCurrency(currency, tokenPrice)}
        />
      ) : (
        <CurrencySelectorNFTs onCurrencySelect={(currency, tokenPrice) => setSelectCurrency(currency, tokenPrice)} />
      );

    return (
      <Button
        type="button"
        variant="outline"
        className="w-full rounded-3xl px-4"
        onClick={() => mustBeConnected([() => setUserSidebarOpen(true), () => setUserSidebarContent(currencyPanel)])}
      >
        {selectedCurrency ? (
          <div className="flex flex-1 items-center gap-2 text-ellipsis whitespace-nowrap">
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

CurrencySelectorInput.displayName = "CurrencySelectorInput";

export { CurrencySelectorInput };

import { forwardRef, useState } from "react";
import { EvmNftData } from "moralis/common-evm-utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { mustBeConnected } from "utils/mustBeConnected";
import { setUserSidebarOpen, setUserSidebarContent } from "state";

import { Button } from "@components/ui/button";
import CurrencySelectorNftWrapper from "@components/currency-selector/currency-selector-nft-wrapper";

import type { SupportedToken } from "config/constants/bond-tokens";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedCurrency: any;
  supportedTokens?: SupportedToken[];
  setSelectCurrency: (currency: EvmNftData) => void;
}

const CurrencySelectorNftInput = forwardRef<HTMLInputElement, InputProps>(
  ({ selectedCurrency, setSelectCurrency, supportedTokens, ...props }, ref) => {
    const [nftImage, setNftImage] = useState("");

    // Determine the currency panel to display
    const currencyPanel = (
      <CurrencySelectorNftWrapper
        supportedNfts={supportedTokens}
        onCurrencySelect={(currency, nftImage) => {
          setNftImage(nftImage);
          setSelectCurrency(currency);
        }}
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
          <div className="flex flex-1 items-center gap-2 text-ellipsis whitespace-nowrap">
            <img
              src={nftImage}
              className="-ml-4 rounded-lg object-cover ring-1 ring-input"
              alt={selectedCurrency.name}
              width={50}
              height={50}
            />

            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-200">
              {selectedCurrency.name} - {selectedCurrency.symbol} - {selectedCurrency.tokenId}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">Select an NFT...</span>
        )}

        <ChevronDownIcon className="ml-auto h-5 w-5 dark:text-brand" />
      </Button>
    );
  }
);

CurrencySelectorNftInput.displayName = "CurrencySelectorNftInput";

export { CurrencySelectorNftInput };

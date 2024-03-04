/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { Token } from "@brewlabs/sdk";
import { getAddress } from "@ethersproject/address";

import { useActiveChainId } from "hooks/useActiveChainId";
import { useGlobalState } from "state";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import CurrencySelector from "components/CurrencySelector";
import TokenLogo from "@components/logo/TokenLogo";
import { isAddress } from "utils";
import { useTokenList } from "state/home/hooks";

const TokenSelect = ({ selectedCurrency, setSelectedCurrency }) => {
  const { chainId } = useActiveChainId();
  const supportedTokens = useTokenList(chainId);

  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");

  const filteredTokenList = useMemo(
    () =>
      supportedTokens
        .filter((t) => isAddress(t.address) && t.chainId === chainId && t.address)
        .map((t) => new Token(chainId, getAddress(t.address), t.decimals, t.symbol, t.name, undefined, t.logoURI)),
    [supportedTokens.length]
  );

  function onUserInput(input, currency) {}
  function onCurrencySelect(input, currency) {
    setSelectedCurrency(currency);
  }

  return (
    <div className="mb-4 rounded-full border border-gray-600 bg-opacity-60 py-2 pl-2 pr-4 font-brand  text-white focus-within:border-amber-300 hover:border-amber-300 dark:bg-zinc-900 dark:bg-opacity-60">
      <button
        type="button"
        className=" flex w-full items-center justify-between"
        onClick={() => {
          setIsOpen(isOpen === 1 ? 1 : 2);
          setSidebarContent(
            <CurrencySelector
              inputType={"input"}
              selectedCurrency={null}
              onUserInput={onUserInput}
              type={""}
              onCurrencySelect={onCurrencySelect}
              filteredCurrencies={filteredTokenList}
            />
          );
        }}
      >
        {selectedCurrency ? (
          <div className="flex flex-1 items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <TokenLogo
              src={getTokenLogoURL(selectedCurrency.address, chainId, selectedCurrency.logo)}
              classNames="h-6 w-6"
            />

            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-200">
              {selectedCurrency.symbol}
            </span>
          </div>
        ) : (
          <span className="flex-1 text-sm font-medium">Select Token...</span>
        )}
        <ChevronDownIcon className="ml-2 h-5 w-5 dark:text-brand" />
      </button>
    </div>
  );
};

export default TokenSelect;

import React, { KeyboardEvent, useCallback, useState, useMemo } from "react";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { Currency, NATIVE_CURRENCIES, Token } from "@brewlabs/sdk";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

import { MORALIS_CHAIN_NAME } from "config/constants/networks";
import factoryTokens from "config/constants/tokens/factoryTokens.json";
import { isAddress } from "utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useDebounce from "hooks/useDebounce";
import { useAllTokens, useToken, useFoundOnInactiveList } from "hooks/Tokens";
import useTokenComparator from "hooks/useTokenComparator";
import useTokenMarketChart, { defaultMarketData } from "hooks/useTokenMarketChart";
import useWalletTokens from "hooks/useWalletTokens";
import { useCurrencyBalance, useNativeBalances } from "state/wallet/hooks";

import { CurrencyLogo } from "components/logo";
import { PrimaryOutlinedButton } from "components/button/index";
import { filterTokens, useSortedTokensByQuery } from "components/searchModal/filtering";

import { useGlobalState } from "state";

import { Field } from "state/swap/actions";
import { useSwapActionHandlers } from "state/swap/hooks";

interface CurrencySelectorProps {
  inputType: "input" | "output";
  selectedCurrency?: Currency | null;
  otherSelectedCurrency?: Currency | null;
  filteredCurrencies?: Currency[];
}

const CurrencyRow = ({
  currency,
  marketData,
  inputType,
}: {
  currency: Currency;
  marketData: any;
  inputType: "input" | "output";
}) => {
  const { account } = useActiveWeb3React();
  const input = inputType === "input" ? Field.INPUT : Field.OUTPUT;
  const { usd_24h_change: priceChange24h, usd: tokenPrice } = marketData;
  const balance = useCurrencyBalance(account, currency);
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const { onUserInput, onCurrencySelection, onSwitchTokens } = useSwapActionHandlers();

  return (
    <button
      className="flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent px-4 py-4 hover:bg-gradient-to-r"
      onClick={() => {
        setIsOpen(false);
        onUserInput(input, "");
        onCurrencySelection(input, currency);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <CurrencyLogo currency={currency} size="36px" />
        <div>
          <p className="text-start text-lg">{currency?.symbol}</p>
          <p className="flex items-center justify-start gap-1 text-sm">
            {priceChange24h > 0 ? (
              <span className="flex items-center text-green">
                {priceChange24h.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3" />
              </span>
            ) : (
              <span className="flex items-center text-danger">
                {Math.abs(priceChange24h).toFixed(3)}% <ArrowTrendingDownIcon className="h-3 w-3 dark:text-danger" />
              </span>
            )}
            <span className="text-primary">24HR</span>
          </p>
          <p className={`${priceChange24h > 0 ? "dark:text-green" : "dark:text-danger"} text-[10px]`}>
            {tokenPrice} USD = 1.00 {currency?.symbol}
          </p>
        </div>
      </div>
      {balance && !balance.equalTo(0) && (
        <div className="text-end">
          <p>{balance.toFixed(3)}</p>
          <p className="text-sm opacity-40">
            {new BigNumber(balance.toSignificant()).times(tokenPrice).toFixed(4)} USD
          </p>
        </div>
      )}
    </button>
  );
};

const CurrencySelector = ({ inputType, filteredCurrencies }: CurrencySelectorProps) => {
  const { chainId, account } = useActiveWeb3React();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder] = useState<boolean>(false);

  const allTokens = useAllTokens();

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery);

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();
    return s === "" || s === "b" || s === "bn" || s === "bnb";
  }, [debouncedQuery]);

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery);

  const onInputAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      // Do something with e.target.value
      const input = e.target.value;
      const checksummedInput = isAddress(input);
      setSearchQuery(checksummedInput || input);
    }
  };

  const onInputEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === NATIVE_CURRENCIES[chainId].symbol.toLowerCase()) {
          // handleCurrencySelect(NATIVE_CURRENCIES[chainId]);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            // handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, debouncedQuery, chainId]
  );

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery);

  const currencies =
    filteredCurrencies?.length > 0
      ? filteredCurrencies
      : filteredInactiveTokens
      ? filteredSortedTokens.concat(filteredInactiveTokens)
      : filteredSortedTokens;

  const walletTokens = useWalletTokens(account, MORALIS_CHAIN_NAME[chainId]);
  const itemData: (Currency | undefined)[] = useMemo(() => {
    if (!chainId) return [];
    let formatted: (Currency | undefined)[] = showETH ? [NATIVE_CURRENCIES[chainId], ...currencies] : currencies;
    return formatted;
  }, [currencies, showETH, chainId]);

  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const ethBalance = useNativeBalances([account])[account];

  const listingTokens: (Currency | undefined)[] = useMemo(() => {
    if (activeTab === 0) return itemData;

    if (activeTab === 1)
      return itemData.filter(
        (_token) =>
          (_token?.isNative && ethBalance?.greaterThan(0)) ||
          walletTokens.find((__token) => _token?.symbol === __token?.symbol)
      );

    if (activeTab === 2)
      return itemData.filter((_token) => factoryTokens.find((__token) => _token?.symbol === __token?.symbol));
  }, [activeTab, itemData, ethBalance, walletTokens]);

  const tokenMarketData = useTokenMarketChart(
    listingTokens
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((currency) => currency?.wrapped?.address),
    chainId
  );

  const totalPages = useMemo(() => Math.ceil(listingTokens.length / rowsPerPage), [listingTokens, rowsPerPage]);

  const nextPage = () => {
    setPage((page + 1) % totalPages);
  };
  const prevPage = () => {
    setPage((page - 1) % totalPages);
  };

  const tabs = [
    {
      name: "Popular",
    },
    {
      name: "Wallet",
    },
    {
      name: "Brewlabs factory",
    },
  ];

  return (
    <div className="relative w-full">
      <div className="mb-6 font-brand">
        <h2 className="text-3xl">Select token {inputType}</h2>
      </div>

      <nav className="mb-4 flex space-x-4" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab.name}
            onClick={() => {
              setPage(0);
              setActiveTab(index);
            }}
            className={clsx(
              index === activeTab ? "bg-gray-700 text-brand" : "bg-gray-800 text-gray-500 hover:text-gray-400",
              "rounded-2xl px-4 py-2 text-sm"
            )}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      <input
        onChange={onInputAddress}
        onKeyDown={onInputEnter}
        inputMode="decimal"
        type="text"
        placeholder="Search by contract address..."
        className="input-bordered input w-full"
      />

      <div className="mt-3 px-2">
        <div>
          {activeTab === 2 ? (
            <p className="my-10 flex justify-center text-2xl dark:text-primary">Coming soon</p>
          ) : listingTokens.length > 0 ? (
            listingTokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((currency, index) => {
              const tokenAddress = currency?.wrapped?.address?.toLowerCase();
              return (
                <CurrencyRow
                  key={index}
                  currency={currency}
                  inputType={inputType}
                  marketData={tokenMarketData[tokenAddress] || defaultMarketData}
                />
              );
            })
          ) : (
            <>
              <img className="m-auto" alt="No results" src="/images/Brewlabs--no-results-found-transparent.gif" />
              <p className="my-7 flex justify-center text-2xl dark:text-primary">No Result Found</p>
            </>
          )}
        </div>
      </div>
      {listingTokens.length > 0 && (
        <div className="mt-3 mb-2 flex justify-center gap-5">
          <PrimaryOutlinedButton disabled={page === 0} onClick={prevPage}>
            Back
          </PrimaryOutlinedButton>
          <PrimaryOutlinedButton disabled={page === totalPages - 1} onClick={nextPage}>
            Next
          </PrimaryOutlinedButton>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;

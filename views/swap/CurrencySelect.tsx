import React, { KeyboardEvent, useCallback, useState, useMemo, useEffect } from "react";
import { Currency, currencyEquals, NATIVE_CURRENCIES, Token } from "@brewlabs/sdk";
import {
  XMarkIcon,
  CheckCircleIcon,
  BeakerIcon,
  ShoppingCartIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

import { MORALIS_CHAIN_NAME } from "config/constants/networks";
import factoryTokens from "config/constants/factoryTokens.json";
import { CurrencyLogo } from "components/logo";
import { PrimaryOutlinedButton } from "components/button/index";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useDebounce from "hooks/useDebounce";
import { useAllTokens, useToken, useFoundOnInactiveList } from "hooks/Tokens";
import useTokenComparator from "hooks/useTokenComparator";
import { filterTokens, useSortedTokensByQuery } from "components/searchModal/filtering";
import useTokenPriceChange from "hooks/useTokenPriceChange";
import useCoingeckoTokenId from "hooks/useCoingeckoTokenId";
import useTokenPrice from "hooks/useTokenPrice";
import { isAddress } from "utils";
import { motion } from "framer-motion";
import { useCurrencyBalance } from "state/wallet/hooks";
import BigNumber from "bignumber.js";
import useWalletTokens from "hooks/useWalletTokens";

interface CurrencySelectProps {
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  filteredCurrencies?: Currency[];
  layoutId: string;
}

const CurrencyRow = ({ currency, onSelect }: { currency: Currency; onSelect: (currency: Currency) => void }) => {
  const { account } = useActiveWeb3React();
  const coingeckoId = useCoingeckoTokenId(currency?.symbol);
  const priceChange24h = useTokenPriceChange(coingeckoId);
  const tokenPrice = useTokenPrice(currency?.chainId, currency?.wrapped?.address);
  const balance = useCurrencyBalance(account, currency);

  return (
    <>
      <div className="mb-2 flex justify-between gap-2">
        <div
          className="flex w-full cursor-pointer justify-between rounded-lg px-4 py-4 hover:border hover:border-brand dark:bg-[#180404]/[.23]"
          onClick={() => onSelect(currency)}
        >
          <div className="flex items-center justify-between">
            <CurrencyLogo currency={currency} size="36px" style={{ marginRight: "8px" }} />
            <div className="">
              <p className="text-lg">{currency?.symbol}</p>
              <p className="flex items-center justify-start gap-1 text-xs">
                {priceChange24h > 0 ? (
                  <span className="flex items-center text-green">
                    {priceChange24h.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="flex items-center text-warning">
                    {Math.abs(priceChange24h).toFixed(3)}%{" "}
                    <ArrowTrendingDownIcon className="h-3 w-3 dark:text-warning" />
                  </span>
                )}
                <span className="text-primary">24HR</span>
              </p>
              <p className={`${priceChange24h > 0 ? "dark:text-green" : "dark:text-warning"} text-[10px]`}>
                {tokenPrice.toFixed(2)} USD = 1.00 {currency?.symbol}
              </p>
            </div>
          </div>
          {balance && !balance.equalTo(0) && (
            <div className="text-end">
              <p>{balance.toFixed(3)}</p>
              <p className="text-xs opacity-40">
                {new BigNumber(balance.toSignificant()).times(tokenPrice).toFixed(4)} USD
              </p>
            </div>
          )}
        </div>
        <button
          className="flex min-w-[60px] items-center justify-center rounded-lg hover:opacity-60 dark:bg-primary dark:text-black"
          onClick={() => onSelect(currency)}
        >
          <ChevronDoubleRightIcon className="h-7 w-7" />
        </button>
      </div>
    </>
  );
};

const CurrencySelect = ({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  filteredCurrencies,
  layoutId,
}: CurrencySelectProps) => {
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

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onCurrencySelect]
  );
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
          handleCurrencySelect(NATIVE_CURRENCIES[chainId]);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery, chainId]
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
    let formatted: (Currency | undefined)[] = showETH ? [NATIVE_CURRENCIES[chainId], ...currencies] : currencies;
    return formatted;
  }, [currencies, showETH, chainId]);

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const switchTab = (tab) => {
    setTab(tab);
    setPage(0);
  };

  const listingTokens: (Currency | undefined)[] = useMemo(() => {
    if (tab === 0) return itemData;
    if (tab === 1)
      return itemData.filter((_token) => walletTokens.find((__token) => _token?.symbol === __token.symbol));
    if (tab === 2)
      return itemData.filter((_token) => factoryTokens.find((__token) => _token?.symbol === __token.symbol));
  }, [itemData, tab]);

  const totalPages = useMemo(() => Math.ceil(listingTokens.length / rowsPerPage), [listingTokens, rowsPerPage]);

  const nextPage = () => {
    setPage((page + 1) % totalPages);
  };
  const prevPage = () => {
    setPage((page - 1) % totalPages);
  };

  return (
    <motion.div layoutId={layoutId}>
      <div className="mx-auto mb-4 font-brand" style={{ maxWidth: "500px" }}>
        <div className="flex items-center justify-between rounded-lg px-4 py-3 shadow-lg dark:bg-[#180404]/[.2]">
          <p className="text-2xl">Token Select</p>
          <XMarkIcon className="h-6 w-6 cursor-pointer dark:text-slate-400" onClick={onDismiss} />
        </div>
        <div className="mt-1 rounded-lg px-9 py-4 shadow-lg dark:bg-[#180404]/[.2]">
          <div className="mt-2">
            <input
              onChange={onInputAddress}
              onKeyDown={onInputEnter}
              inputMode="decimal"
              placeholder="Enter contract address..."
              className="w-full rounded-lg border bg-transparent px-2 py-1 text-2xl placeholder-primary outline-0 dark:border-primary dark:text-primary"
            />
          </div>
          <div className="my-3 grid grid-cols-2 justify-between gap-1 sm:flex">
            <div
              className="flex cursor-pointer items-center justify-start gap-2 rounded-lg border px-3 py-1 dark:border-green dark:text-green"
              onClick={() => switchTab(0)}
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span className="text-lg">Popular</span>
            </div>
            <div
              className="flex cursor-pointer items-center justify-start gap-2 rounded-lg border px-3 py-1"
              onClick={() => switchTab(1)}
            >
              <p>
                <ShoppingCartIcon className="h-5 w-5" />
              </p>
              <p className="text-lg">My Wallet</p>
            </div>
            <div
              className="flex cursor-pointer items-center justify-start gap-2 rounded-lg border px-3 py-1 dark:border-primary dark:text-primary"
              onClick={() => switchTab(2)}
            >
              <BeakerIcon className="h-5 w-5" />
              <span className="text-lg">Factory</span>
            </div>
          </div>
          <div className="mt-3 px-2">
            {tab === 2 ? (
              <p className="my-7 flex justify-center text-2xl dark:text-primary">Coming soon</p>
            ) : listingTokens.length > 0 ? (
              listingTokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((currency, index) => {
                return <CurrencyRow currency={currency} onSelect={handleCurrencySelect} key={index} />;
              })
            ) : (
              <p className="my-7 flex justify-center text-2xl dark:text-primary">No Result Found</p>
            )}
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
      </div>
    </motion.div>
  );
};

export default CurrencySelect;

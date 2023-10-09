import React, { KeyboardEvent, useCallback, useState, useMemo, useContext, useEffect } from "react";
import { Currency, NATIVE_CURRENCIES, Token } from "@brewlabs/sdk";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import BigNumber from "bignumber.js";
import clsx from "clsx";

import { MORALIS_CHAIN_NAME } from "config/constants/networks";
import { factoryTokens, popularTokens } from "config/constants/tokens";
import { DashboardContext } from "contexts/DashboardContext";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useDebounce from "hooks/useDebounce";
import { useAllTokens, useToken, useFoundOnInactiveList, useCurrency } from "hooks/Tokens";
import useTokenComparator from "hooks/useTokenComparator";
import useWalletTokens from "hooks/useWalletTokens";
import { useGlobalState } from "state";
import { Field } from "state/swap/actions";
import { Field as LiquidityField } from "state/mint/actions";
import { useSwapActionHandlers } from "state/swap/hooks";
import { isVerified, useCurrencyBalance, useNativeBalances } from "state/wallet/hooks";
import { isAddress } from "utils";

import { CurrencyLogo } from "components/logo";
import { PrimaryOutlinedButton } from "components/button/index";
import { filterTokens, useSortedTokensByQuery } from "components/searchModal/filtering";
import UserDashboard from "components/dashboard/UserDashboard";

import { useFetchMarketData, useTokenMarketChart } from "state/prices/hooks";
import { defaultMarketData } from "state/prices/types";
import DropDown from "@components/dashboard/TokenList/Dropdown";
import { StarIcon } from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { useCGListings, useCMCListings } from "@hooks/chart/useScrappingSite";
import { ChartContext } from "contexts/ChartContext";
import { addPairs, fetchPairsAsync } from "state/chart";
import { usePairsByCriteria, usePairsByCriterias } from "state/chart/hooks";
import TokenLogo from "@components/logo/TokenLogo";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { BigNumberFormat, getChainLogo } from "utils/functions";
import { DEX_LOGOS } from "config/constants/swap";

import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";
import { fetchAllPairs } from "state/chart/fetchPairInfo";
import { DEXSCREENER_CHAINNAME } from "config";
import { useRouter } from "next/router";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const tabs = [
  { icon: <StarIcon className="h-4 w-4" />, name: "Favourites" },
  {
    icon: <img src={"/images/chart/trending/cmc.png"} alt={""} className="h-4 w-4 rounded-full" />,
    name: "CMC Trending",
  },
  {
    icon: <img src={"/images/chart/trending/cmc.png"} alt={""} className="h-4 w-4 rounded-full" />,
    name: "CMC Recently Added",
  },
  {
    icon: <img src={"/images/chart/trending/cg.png"} alt={""} className="h-4 w-4 rounded-full" />,
    name: "CG Trending",
  },
  {
    icon: <img src={"/images/chart/trending/cg.png"} alt={""} className="h-4 w-4 rounded-full" />,
    name: "CG Top Gainers",
  },
  {
    icon: <img src={"/images/chart/trending/cg.png"} alt={""} className="h-4 w-4 rounded-full" />,
    name: "CG Top Losers",
  },
];

const CurrencyRow = ({ pair }: { pair: any }) => {
  const router = useRouter();
  const [, setIsOpen] = useGlobalState("userSidebarOpen");
  return (
    <>
      <button
        className="flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent px-4 py-4 hover:bg-gradient-to-r"
        onClick={() => {
          router.push(`/chart/${DEXSCREENER_CHAINNAME[pair.chainId]}/${pair.address}`);
          setIsOpen(0);
        }}
      >
        <div className="flex items-center justify-between gap-12">
          <div className="flex w-[220px] items-center">
            <TokenLogo
              src={getTokenLogoURL(isAddress(pair.baseToken.address), pair.chainId)}
              classNames="primary-shadow z-10 h-10 w-10 rounded-full"
            />
            <div className="ml-4 text-start">
              <p className="text-lg">
                {pair.baseToken.symbol} /{" "}
                <span className="text-sm leading-none text-gray-500">{pair.quoteToken.symbol}</span>
              </p>
              <p className="flex items-center justify-start gap-1 text-sm">
                {pair.priceChange.h24 > 0 ? (
                  <span className="flex items-center text-green">
                    {pair.priceChange.h24.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="flex items-center text-danger">
                    {Math.abs(pair.priceChange.h24).toFixed(3)}%{" "}
                    <ArrowTrendingDownIcon className="h-3 w-3 dark:text-danger" />
                  </span>
                )}
                <span className="text-primary">24HR</span>
              </p>
              <p className={`${pair.priceChange.h24 > 0 ? "dark:text-green" : "dark:text-danger"} text-[10px]`}>
                {pair.priceUsd} USD = 1.00 {pair.baseToken.symbol}
              </p>
            </div>
          </div>
          <div className="hidden w-[110px] sm:block">
            <p className="text-lg">Liq. {BigNumberFormat(pair.liquidity?.usd ?? 0)}</p>
            <p className="text-sm">
              Vol. {BigNumberFormat(pair.volume?.h24 ?? 0)} <span className="text-gray-500">24h</span>
            </p>
          </div>
          <div className="hidden w-[120px] flex-col items-center sm:flex">
            <div className="flex">
              <img src={getChainLogo(pair.chainId)} alt={""} className="primary-shadow h-6 w-6 rounded-full" />
              <img src={DEX_LOGOS[pair.dexId]} alt={""} className="primary-shadow h-6 w-6 rounded-full" />
            </div>
            <div>{pair.pairCreatedAt ? timeAgo.format(pair.pairCreatedAt) : ""}</div>
          </div>
        </div>
      </button>
    </>
  );
};

let searchTimeout;

const CurrencySelector = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [criteria, setCriteria] = useState("");
  const [cri, setCri] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch: any = useDispatch();
  const { trendings, newListings }: any = useCMCListings();
  const { trendings: cgTrendings, gainers: cgGainers, losers: cgLosers }: any = useCGListings();
  const { favourites }: any = useContext(ChartContext);

  const arrays = [favourites.map((pair) => pair.address), trendings, newListings, cgTrendings, cgGainers, cgLosers];

  const selectedPairs = usePairsByCriterias(activeTab === -1 ? [] : arrays[activeTab]);
  const searchedPairs = usePairsByCriteria(activeTab === -1 ? criteria : "", null, 10);

  useEffect(() => {
    setActiveTab(0);
    setCri("");
    setCriteria("");
    if (window) setRowsPerPage(Math.floor((window.innerHeight - 300) / 96));
  }, []);

  const stringifiedArrays = JSON.stringify(arrays[activeTab]);
  useEffect(() => {
    if (activeTab === -1) {
    } else {
      arrays[activeTab].map((criteria) => dispatch(fetchPairsAsync(criteria, null, "simple")));
    }
  }, [activeTab, stringifiedArrays]);

  const showPairs = activeTab === -1 ? searchedPairs : selectedPairs;
  const totalPages = useMemo(() => Math.ceil(showPairs.length / rowsPerPage), [showPairs, rowsPerPage]);

  const nextPage = () => {
    setPage((page + 1) % totalPages);
  };
  const prevPage = () => {
    setPage((page - 1) % totalPages);
  };

  useEffect(() => {
    if (searchTimeout != undefined) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      setCriteria(cri);
      if (cri === "") return;
      setLoading(true);
      const searchedPairs = await fetchAllPairs(cri, null, "simple");
      setLoading(false);
      dispatch(addPairs(searchedPairs));
    }, 500);
  }, [cri]);

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select token</h2>
        </div>
      </div>

      <nav className="mb-2 hidden flex-wrap justify-between space-x-4 sm:flex" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTab(index);
              setPage(0);
              setCriteria("");
              setCri("");
            }}
            className={clsx(
              index === activeTab ? "bg-gray-700 text-brand" : "bg-gray-800 text-gray-500 hover:text-gray-400",
              "!ml-0 mb-2 flex w-[calc((100%-32px)/3)] items-center whitespace-nowrap rounded-2xl px-4 py-2 text-sm"
            )}
          >
            <div className="-mt-0.5 mr-1.5">{tab.icon}</div>
            <div>{tab.name}</div>
          </button>
        ))}
      </nav>

      <nav className="mb-4 block sm:hidden" aria-label="Tabs">
        <DropDown
          width="w-full"
          value={activeTab}
          setValue={(i) => {
            setActiveTab(i);
          }}
          type="secondary"
          values={tabs.map((data) => data.name)}
        />
      </nav>

      <input
        value={cri}
        onChange={(e) => {
          setCri(e.target.value);
          setActiveTab(-1);
        }}
        type="text"
        placeholder="Search by contract address or by name"
        className="input-bordered input w-full"
      />

      <div className="mt-3 px-2">
        <div>
          {showPairs.length > 0 ? (
            showPairs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pair, index) => {
              return <CurrencyRow key={index} pair={pair} />;
            })
          ) : (activeTab === -1 ? loading : arrays[activeTab].length) ? (
            <>
              <p className="my-7 flex justify-center text-2xl dark:text-primary">Loading Token ...</p>
            </>
          ) : (
            <>
              <img className="m-auto" alt="No results" src="/images/Brewlabs--no-results-found-transparent.gif" />
              <p className="my-7 flex justify-center text-2xl dark:text-primary">No Result Found</p>
            </>
          )}
        </div>
      </div>

      {showPairs.length > 0 && (
        <div className="mb-2 mt-3 flex justify-center gap-5">
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

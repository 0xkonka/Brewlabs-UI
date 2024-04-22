import { useMemo } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { Token } from "@brewlabs/sdk";
import { useEvmWalletTokenBalances } from "@moralisweb3/next";
import { Erc20Value } from "@moralisweb3/common-evm-utils";
import { CircleAlertIcon, CircleSlashIcon } from "lucide-react";

import { useGlobalState } from "state";
import { useTokenMarketChart } from "state/prices/hooks";
import { defaultMarketData } from "state/prices/types";

import { useActiveChainId } from "@hooks/useActiveChainId";

import getTokenLogoURL from "utils/getTokenLogoURL";

import MarketPrice24h from "components/MarketPrice24h";
import CurrencySelectorNative from "components/currencySelector/CurrencySelectorNative";
import CurrencySelectorSkeleton from "components/currencySelector/CurrencySelectorSkeleton";

type SupportedToken = {
  chainId: number;
  name: string;
  symbol: string;
  address: string;
};

type CurrencySelectorFromWalletProps = {
  supportedTokens?: SupportedToken[];
  onCurrencySelect: (token: Token) => void;
};

const CurrencySelectorFromWallet = ({ onCurrencySelect, supportedTokens = [] }: CurrencySelectorFromWalletProps) => {
  const [userSidebarOpen, setUserSidebarOpen] = useGlobalState("userSidebarOpen");

  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const tokenMarketData = useTokenMarketChart(chainId);

  // Look to cache this somehow
  // Better off making using v2 since it has verified?
  const { data: walletTokens, isFetching } = useEvmWalletTokenBalances({ address, chain: chainId });

  const filteredWalletTokens = useMemo(() => {
    // Remove spam tokens and zero values
    const removedSpam =
      walletTokens?.filter((i) => !i.token.possibleSpam && Number(i.amount) > 0 && i.token.logo) || [];

    // Remove wallet tokens from supported tokens to avoid duplicates
    const supportedTokensNotInWallet = supportedTokens.filter((t) => {
      return !removedSpam?.some((i) => i.token.contractAddress.lowercase.toString() === t.address.toLowerCase());
    });

    return {
      validTokens: removedSpam.reverse(),
      supportedTokens: supportedTokensNotInWallet,
    };
  }, [supportedTokens, walletTokens]);

  const handleCurrencySelection = (currency: Erc20Value["token"]) => {
    // Close the side panel
    setUserSidebarOpen(0);

    // Convert currency type to token type
    const token = new Token(
      chainId,
      currency.contractAddress.lowercase.toString(),
      currency.decimals,
      currency.symbol,
      currency.name,
      undefined,
      currency.logo
    );

    onCurrencySelect(token);
  };

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select a token from your wallet</h2>
          <h3 className="text-xl">Only supported tokens are selectable</h3>
        </div>
      </div>

      <input type="text" className="input-bordered input w-full" placeholder="Search by contract address or by name" />

      <div className="mt-3 h-[75svh] w-full overflow-y-auto px-2">
        <CurrencySelectorNative supportedTokens={supportedTokens} />

        {isFetching && <CurrencySelectorSkeleton count={6} />}

        {!isFetching &&
          filteredWalletTokens.validTokens.map((token) => {
            const { name, logo, symbol, contractAddress } = token.token;

            const amountAsBigInt = BigInt(Number(token.amount));
            const addressAsString = contractAddress.lowercase.toString();

            const tokenPrice = tokenMarketData[addressAsString]?.usd || 0;
            const balance = Number(formatUnits(amountAsBigInt, token.decimals));

            const notSupported =
              supportedTokens.length > 0
                ? !supportedTokens.some((t) => t.address.toLowerCase() === addressAsString)
                : false;

            return (
              <button
                type="button"
                key={addressAsString}
                disabled={notSupported}
                onClick={() => handleCurrencySelection(token.token)}
                className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
              >
                <div className="flex w-full items-center justify-between p-5 pl-0">
                  <div className="flex gap-3">
                    <div className="relative">
                      {notSupported && (
                        <CircleAlertIcon className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
                      )}

                      <img
                        className="mt-1 h-10 w-10 rounded-full bg-slate-500 "
                        src={getTokenLogoURL(addressAsString, chainId, logo)[0]}
                        alt={name}
                      />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">{name}</h3>

                      <MarketPrice24h
                        marketData={tokenMarketData[addressAsString] || defaultMarketData}
                        symbol={symbol}
                      />
                    </div>
                  </div>

                  <div className="text-end">
                    {notSupported && <p className="text-red-500">Not supported</p>}
                    <p>
                      {balance.toFixed(2)} {symbol}
                    </p>
                    <p className="text-sm opacity-40">{(balance * tokenPrice).toFixed(4)} USD</p>
                  </div>
                </div>
              </button>
            );
          })}
        {!isFetching &&
          filteredWalletTokens.supportedTokens.map((token) => (
            <div key={token.address} className="flex w-full justify-between border-b border-gray-600 text-start">
              <div className="flex w-full items-center justify-between p-5 pl-0">
                <div className="flex gap-3">
                  <div className="relative">
                    <CircleSlashIcon className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
                    <img
                      className="mt-1 h-10 w-10 rounded-full bg-slate-500"
                      src={getTokenLogoURL(token.address, chainId)[0]}
                      alt={token.name}
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{token.name}</h3>

                    <MarketPrice24h
                      marketData={tokenMarketData[token.address] || defaultMarketData}
                      symbol={token.symbol}
                    />
                  </div>
                </div>

                <div className="text-end">
                  <p className="text-red-500">Supported but not owned</p>
                  <p>0 {token.symbol}</p>
                  <p className="text-sm opacity-40">0 USD</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CurrencySelectorFromWallet;

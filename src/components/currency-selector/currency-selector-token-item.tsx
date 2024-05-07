import { formatUnits } from "viem";
import { CircleAlertIcon } from "lucide-react";

import { Token } from "@brewlabs/sdk";

import { useMarketData } from "@hooks/useMarketData";
import MarketPrice24h from "components/MarketPrice24h";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { Skeleton } from "@components/ui/skeleton";

// TODO: Better placement of type def
import type { WalletTokensFromMoralis } from "hooks/useMoralisWalletTokens";

type CurrencySelectorItemProps = {
  token: WalletTokensFromMoralis;
  chainId: number;
  isSupported: boolean;
  handleCurrencySelection?: (token: Token, tokenPrice: number) => void;
};

const CurrencySelectorTokenItem = ({
  token,
  chainId,
  isSupported,
  handleCurrencySelection,
}: CurrencySelectorItemProps) => {
  const amountAsBigInt = BigInt(Number(token.balance));
  const balance = Number(formatUnits(amountAsBigInt, token.decimals));

  // Get the token price
  // Will retrieve cached value if available
  const { data: tokenPrice, isLoading } = useMarketData({ chain: chainId, address: token.token_address });

  // Convert WalletTokensFromMoralis to Token
  const asToken = (currency: WalletTokensFromMoralis): Token => {
    return new Token(
      chainId,
      currency.token_address,
      currency.decimals,
      currency.symbol,
      currency.name,
      undefined,
      currency.logo
    );
  };

  return (
    <button
      type="button"
      disabled={!isSupported}
      onClick={() => handleCurrencySelection(asToken(token), tokenPrice.usd)}
      className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
    >
      <div className="flex w-full items-center justify-between p-5 pl-0">
        <div className="flex gap-3">
          <div className="relative">
            {!isSupported && (
              <CircleAlertIcon className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
            )}

            <img
              className="mt-1 h-10 w-10 rounded-full bg-slate-500 "
              src={getTokenLogoURL(token.token_address, chainId, token.logo)[0]}
              alt={token.name}
            />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{token.name}</h3>
            {tokenPrice && (
              <MarketPrice24h
                usdPrice={tokenPrice.usd}
                usd24hChange={tokenPrice.usd_24h_change}
                symbol={token.symbol}
              />
            )}
          </div>
        </div>

        <div className="text-end">
          {!isSupported && <p className="text-red-500">Not supported</p>}
          <p>
            {balance.toFixed(2)} {token.symbol}
          </p>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <p className="text-sm opacity-40">{(balance * tokenPrice?.usd || 0).toFixed(4)} USD</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default CurrencySelectorTokenItem;

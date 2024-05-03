import { useAccount, useBalance } from "wagmi";

import { NATIVE_CURRENCIES } from "@brewlabs/sdk";
import { CircleAlertIcon } from "lucide-react";

import { useActiveChainId } from "@hooks/useActiveChainId";
import MarketPrice24h from "components/MarketPrice24h";
import CurrencySelectorSkeleton from "components/currencySelector/CurrencySelectorSkeleton";

import { Skeleton } from "@components/ui/skeleton";

import { Token } from "@brewlabs/sdk";

import getTokenLogoURL from "utils/getTokenLogoURL";

import { useMarketData } from "@hooks/useMarketData";

type CurrencySelectorNativeProps = {
  supportedTokens: any[];
  handleCurrencySelection: (token: Token, tokenPrice: number) => void;
};

const CurrencySelectorNative = ({ supportedTokens, handleCurrencySelection }: CurrencySelectorNativeProps) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const nativeToken = NATIVE_CURRENCIES[chainId];
  const nativeTokenAddress = NATIVE_CURRENCIES[chainId].wrapped.address;

  // Get the token price
  // Will retrieve cached value if available
  const {
    data: nativeTokenPrice,
    isError: isErrorTokenPrice,
    isLoading: isLoadingTokenPrice,
  } = useMarketData({ chain: chainId, address: nativeTokenAddress });

  // Get the native token balance
  // Using Wagmi, Moralis was unreliable
  const {
    data: nativeBalance,
    isError,
    isLoading,
  } = useBalance({
    address,
    chainId,
  });

  if (isLoading) {
    return <CurrencySelectorSkeleton count={1} />;
  }

  const balanceAsNumber = Number(nativeBalance.formatted);

  const notSupported =
    supportedTokens.length > 0
      ? !supportedTokens.some((t) => t.address.toLowerCase() === NATIVE_CURRENCIES[chainId].wrapped.address)
      : false;

  // Convert Native Token to Token
  const asToken = (currency): Token => {
    return new Token(
      chainId,
      nativeTokenAddress,
      currency.decimals,
      currency.symbol,
      currency.name,
      undefined,
      getTokenLogoURL(nativeTokenAddress, chainId)[0]
    );
  };

  return (
    <button
      type="button"
      key={nativeTokenAddress}
      disabled={notSupported}
      onClick={() => handleCurrencySelection(asToken(nativeToken), nativeTokenPrice.usd)}
      className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start enabled:hover:bg-gradient-to-r"
    >
      <div className="flex w-full items-center justify-between p-5 pl-0">
        <div className="flex gap-3">
          <div className="relative">
            {notSupported && (
              <CircleAlertIcon className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-gray-800 text-red-500" />
            )}
            <img
              className="mt-1 h-10 w-10 rounded-full bg-slate-500 "
              src={getTokenLogoURL(nativeTokenAddress, chainId)[0]}
              alt={nativeToken.name}
            />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{nativeToken.name}</h3>
            {nativeTokenPrice && (
              <MarketPrice24h
                usdPrice={nativeTokenPrice.usd}
                usd24hChange={nativeTokenPrice.usd_24h_change}
                symbol={nativeToken.symbol}
              />
            )}
          </div>
        </div>

        <div className="text-end">
          {notSupported && <p className="text-red-500">Not supported</p>}
          <p>
            {balanceAsNumber.toFixed(2)} {nativeToken.symbol}
          </p>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <p className="text-sm opacity-40">{(balanceAsNumber * nativeTokenPrice?.usd || 0).toFixed(4)} USD</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default CurrencySelectorNative;

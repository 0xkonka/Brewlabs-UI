import { useAccount, useBalance } from "wagmi";
import { useEvmTokenPrice } from "@moralisweb3/next";
import { NATIVE_CURRENCIES } from "@brewlabs/sdk";
import { CircleAlertIcon } from "lucide-react";

import { useActiveChainId } from "@hooks/useActiveChainId";
import MarketPrice24h from "components/MarketPrice24h";
import CurrencySelectorSkeleton from "components/currencySelector/CurrencySelectorSkeleton";

import { WalletTokensFromMoralis } from "./CurrencySelectorFromWallet";

type CurrencySelectorNativeProps = {
  supportedTokens: any[];
  handleCurrencySelection: (token: WalletTokensFromMoralis, tokenPrice: number) => void;
};

const CurrencySelectorNative = ({ supportedTokens, handleCurrencySelection }: CurrencySelectorNativeProps) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  // Using Moralis: Get the native token price
  const {
    error,
    isFetching,
    data: nativeTokenPrice,
  } = useEvmTokenPrice({
    chain: chainId,
    include: "percent_change",
    address: NATIVE_CURRENCIES[chainId].wrapped.address,
  });

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

  if (error) {
    return <div>Error</div>;
  }

  if (isFetching) {
    return <CurrencySelectorSkeleton count={1} />;
  }

  const nativeToken = NATIVE_CURRENCIES[chainId];
  const balanceAsNumber = Number(nativeBalance.formatted);

  const notSupported =
    supportedTokens.length > 0
      ? !supportedTokens.some((t) => t.address.toLowerCase() === NATIVE_CURRENCIES[chainId].wrapped.address)
      : false;

  return (
    <button
      type="button"
      key={nativeTokenPrice.tokenAddress}
      disabled={notSupported}
      onClick={() => handleCurrencySelection(nativeToken, nativeTokenPrice.usdPrice)}
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
              src={nativeTokenPrice.tokenLogo}
              alt={nativeToken.name}
            />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold">{nativeToken.name}</h3>
            {!isLoading ||
              (!isError && (
                <MarketPrice24h
                  usdPrice={nativeTokenPrice.usdPrice}
                  usd24hChange={Number(nativeTokenPrice["24hrPercentChange"])}
                  symbol={nativeToken.symbol}
                />
              ))}
          </div>
        </div>

        <div className="text-end">
          {notSupported && <p className="text-red-500">Not supported</p>}
          <p>
            {balanceAsNumber.toFixed(2)} {nativeToken.symbol}
          </p>
          <p className="text-sm opacity-40">{(balanceAsNumber * nativeTokenPrice.usdPrice).toFixed(4)} USD</p>
        </div>
      </div>
    </button>
  );
};

export default CurrencySelectorNative;

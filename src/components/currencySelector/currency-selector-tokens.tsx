import { useMemo } from "react";
import { useAccount } from "wagmi";

import { Token } from "@brewlabs/sdk";
import { BananaIcon } from "lucide-react";

import { setUserSidebarOpen, setUserSidebarContent } from "state";

import CurrencySelectorItem from "./currency-selector-token-item";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisWalletTokens } from "@hooks/useMoralisWalletTokens";

import CurrencySelectorNative from "@components/currencySelector/currency-selector-native";
import CurrencySelectorSkeleton from "components/currencySelector/CurrencySelectorSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

type SupportedToken = {
  chainId: number;
  name: string;
  symbol: string;
  address: string;
};

type CurrencySelectorFromWalletProps = {
  supportedTokens?: SupportedToken[];
  onCurrencySelect: (token: Token, tokenPrice: number) => void;
};

const CurrencySelectorTokens = ({ onCurrencySelect, supportedTokens = [] }: CurrencySelectorFromWalletProps) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const { walletTokens, isLoading } = useMoralisWalletTokens({ walletAddress: address, chainId });

  const hasSupportedTokens = useMemo(() => {
    if (supportedTokens.length === 0) return false;

    return walletTokens?.some((token) => {
      return supportedTokens.some((t) => t.address.toLowerCase() === token.token_address);
    });
  }, [supportedTokens, walletTokens]);

  const handleCurrencySelection = (token: Token, tokenPrice: number) => {
    // Close the side panel
    setUserSidebarOpen(false);
    onCurrencySelect(token, tokenPrice);
  };

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select a token from your wallet</h2>
          <h3 className="text-xl">Only supported tokens are selectable</h3>
        </div>
      </div>

      <div className="mt-3 h-[75svh] w-full overflow-y-auto px-2">
        <CurrencySelectorNative supportedTokens={supportedTokens} handleCurrencySelection={handleCurrencySelection} />

        {isLoading && <CurrencySelectorSkeleton count={6} />}

        {walletTokens &&
          walletTokens.map((token) => {
            const isSupported =
              supportedTokens.length > 0
                ? supportedTokens.some((t) => t.address.toLowerCase() === token.token_address)
                : false;

            return (
              <CurrencySelectorItem
                key={token.token_address}
                token={token}
                chainId={chainId}
                isSupported={isSupported}
                handleCurrencySelection={handleCurrencySelection}
              />
            );
          })}

        {!hasSupportedTokens && (
          <Alert className="my-4 border-brand bg-yellow-100/10 text-brand">
            <BananaIcon className="h-4 w-4 !text-brand" />
            <AlertTitle>Slip up!</AlertTitle>
            <AlertDescription>You do not own any supported tokens.</AlertDescription>
          </Alert>
        )}

        {supportedTokens.length !== 0 && !isLoading && (
          <div className="rounded border">
            <h3>Supported tokens</h3>
            {supportedTokens.map((token) => (
              <div key={token.address}>{token.name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySelectorTokens;

import { useMemo } from "react";
import { useAccount } from "wagmi";

import { Token } from "@brewlabs/sdk";
import { BananaIcon } from "lucide-react";

import { setUserSidebarOpen } from "state";

import CurrencySelectorItem from "./currency-selector-token-item";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisWalletTokens } from "@hooks/useMoralisWalletTokens";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import CurrencySelectorNative from "@components/currency-selector/currency-selector-native";
import CurrencySelectorSkeleton from "@components/currency-selector/currency-selector-skeleton";

import type { SupportedToken } from "config/constants/bond-tokens";

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
    <>
      {!hasSupportedTokens && !isLoading && (
        <Alert className="my-4 border-brand bg-yellow-500/10 text-brand">
          <BananaIcon className="h-4 w-4 !text-brand" />
          <AlertTitle>Slip up!</AlertTitle>
          <AlertDescription>You do not own any supported tokens.</AlertDescription>
        </Alert>
      )}

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
    </>
  );
};

export default CurrencySelectorTokens;

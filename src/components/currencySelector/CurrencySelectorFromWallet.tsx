import { useMemo } from "react";
import { useAccount } from "wagmi";

import { Token } from "@brewlabs/sdk";
import { BananaIcon } from "lucide-react";

import { useGlobalState } from "state";

import CurrencySelectorItem from "./CurrencySelectorItem";

import { useActiveChainId } from "@hooks/useActiveChainId";

import CurrencySelectorNative from "components/currencySelector/CurrencySelectorNative";
import CurrencySelectorSkeleton from "components/currencySelector/CurrencySelectorSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

type SupportedToken = {
  chainId: number;
  name: string;
  symbol: string;
  address: string;
};

export type WalletTokensFromMoralis = {
  balance: string;
  decimals: number;
  logo: string | null;
  name: string;
  percentage_relative_to_total_supply: number;
  possible_spam: boolean;
  symbol: string;
  thumbnail: string | null;
  token_address: string;
  total_supply: string;
  total_supply_formatted: string;
  verified_contract: boolean;
};

type CurrencySelectorFromWalletProps = {
  supportedTokens?: SupportedToken[];
  onCurrencySelect: (token: Token, tokenPrice: number) => void;
};

// TODO: fix url
const fetchWalletTokens = async ({ address, chain }) => {
  const res = await fetch("/api/moralis/evmApi/getWalletTokenBalances", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, chain }),
  });

  return res.json();
};

import { useQuery } from "@tanstack/react-query";

const CurrencySelectorFromWallet = ({ onCurrencySelect, supportedTokens = [] }: CurrencySelectorFromWalletProps) => {
  const [userSidebarOpen, setUserSidebarOpen] = useGlobalState("userSidebarOpen");

  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  // Filter the wallet data
  const filterWalletTokens = (walletTokens: WalletTokensFromMoralis[]) =>
    walletTokens.filter((i) => !i.possible_spam && Number(i.balance) > 0 && i.verified_contract);

  // Get the wallet tokens from Moralis + React Query
  const { isLoading, data: walletTokens } = useQuery({
    queryKey: [`userWalletTokens_${address}`],
    queryFn: (): Promise<WalletTokensFromMoralis[]> => fetchWalletTokens({ address, chain: chainId }),
    select: filterWalletTokens,
    refetchOnWindowFocus: false,
  });

  const hasSupportedTokens = useMemo(() => {
    if (supportedTokens.length === 0) return false;

    return walletTokens?.some((token) => {
      return supportedTokens.some((t) => t.address.toLowerCase() === token.token_address);
    });
  }, [supportedTokens, walletTokens]);

  const handleCurrencySelection = (currency: WalletTokensFromMoralis, tokenPrice) => {
    // Close the side panel
    setUserSidebarOpen(0);
    // Convert currency type to token type
    const token = new Token(
      chainId,
      currency.token_address,
      currency.decimals,
      currency.symbol,
      currency.name,
      undefined,
      currency.logo
    );

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

      {!hasSupportedTokens && (
        <Alert className="my-4 border-brand bg-yellow-100/10 text-brand">
          <BananaIcon className="h-4 w-4 !text-brand" />
          <AlertTitle>Slip up!</AlertTitle>
          <AlertDescription>You do not own any supported tokens.</AlertDescription>
        </Alert>
      )}

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
      </div>
    </div>
  );
};

export default CurrencySelectorFromWallet;

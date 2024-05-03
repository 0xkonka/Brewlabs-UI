import { useMemo } from "react";
import { useAccount } from "wagmi";

import { Token } from "@brewlabs/sdk";

import { setUserSidebarOpen, setUserSidebarContent } from "state";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisWalletTokens } from "@hooks/useMoralisWalletTokens";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import CurrencySelectorTokens from "./currency-selector-tokens";

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

const CurrencySelectorWrapper = ({ onCurrencySelect, supportedTokens = [] }: CurrencySelectorFromWalletProps) => {
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
        <Tabs defaultValue="wallet">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet">Tokens owned</TabsTrigger>
            <TabsTrigger value="supported">Supported tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="wallet">
            <CurrencySelectorTokens supportedTokens={supportedTokens} onCurrencySelect={handleCurrencySelection} />
          </TabsContent>
          <TabsContent value="supported">
            {supportedTokens.length !== 0 && !isLoading && (
              <div className="rounded border">
                <h3>Supported tokens</h3>
                {supportedTokens.map((token) => (
                  <div key={token.address}>{token.name}</div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurrencySelectorWrapper;

import { Token } from "@brewlabs/sdk";

import { setUserSidebarOpen } from "state";

import type { SupportedToken } from "config/constants/bond-tokens";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import CurrencySelectorTokens from "components/currency-selector/currency-selector-tokens";
import CurrencySelectorSupportedTokens from "components/currency-selector/currency-selector-supported-tokens";

type CurrencySelectorFromWalletProps = {
  supportedTokens?: SupportedToken[];
  onCurrencySelect: (token: Token, tokenPrice: number) => void;
};

const CurrencySelectorWrapper = ({ onCurrencySelect, supportedTokens = [] }: CurrencySelectorFromWalletProps) => {
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
            <CurrencySelectorSupportedTokens supportedTokens={supportedTokens} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurrencySelectorWrapper;

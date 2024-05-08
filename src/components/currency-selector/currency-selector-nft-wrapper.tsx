import { EvmNftData } from "moralis/common-evm-utils";

import { setUserSidebarOpen } from "state";
import type { SupportedNft } from "config/constants/bond-tokens";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import CurrencySelectorNfts from "components/currency-selector/currency-selector-nfts";
import CurrencySelectorSupportedNfts from "components/currency-selector/currency-selector-supported-nfts";

type CurrencySelectorFromWalletProps = {
  supportedNfts?: SupportedNft[];
  onCurrencySelect: (token: EvmNftData, nftImage: string) => void;
};

const CurrencySelectorNftWrapper = ({ onCurrencySelect, supportedNfts = [] }: CurrencySelectorFromWalletProps) => {
  const handleCurrencySelection = (token: EvmNftData, nftImage: string) => {
    // Close the side panel
    setUserSidebarOpen(false);
    // Convert currency type to token type
    onCurrencySelect(token, nftImage);
  };

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select an NFT from your wallet</h2>
        </div>
      </div>

      <div className="mt-3 h-[75svh] w-full overflow-y-auto px-2">
        <Tabs defaultValue="wallet">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet">NFTs owned</TabsTrigger>
            <TabsTrigger value="supported">Supported NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="wallet">
            <CurrencySelectorNfts supportedNfts={supportedNfts} onCurrencySelect={handleCurrencySelection} />
          </TabsContent>
          <TabsContent value="supported">
            <CurrencySelectorSupportedNfts supportedNfts={supportedNfts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CurrencySelectorNftWrapper;

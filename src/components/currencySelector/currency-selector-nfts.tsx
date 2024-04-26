import { useAccount } from "wagmi";

import { Token } from "@brewlabs/sdk";

import { setUserSidebarOpen } from "state";

import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisWalletNFTs } from "@hooks/useMoralisWalletNFTs";

import CurrencySelectorSkeleton from "components/currencySelector/CurrencySelectorSkeleton";

type SupportedToken = {
  chainId: number;
  name: string;
  symbol: string;
  address: string;
};

type CurrencySelectorFromWalletProps = {
  supportedNFTs?: SupportedToken[];
  onCurrencySelect: (token: Token, tokenPrice: number) => void;
};

const CurrencySelectorNFTs = ({ onCurrencySelect, supportedNFTs = [] }: CurrencySelectorFromWalletProps) => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const { walletNFTs, isLoading } = useMoralisWalletNFTs({ walletAddress: address, chainId });

  const handleCurrencySelection = (currency, tokenPrice) => {
    // Close the side panel
    setUserSidebarOpen(false);
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

  console.log(walletNFTs);

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-brand">
          <h2 className="text-3xl">Select an NFT from your wallet</h2>
          <h3 className="text-xl">Only supported tokens are selectable</h3>
        </div>
      </div>

      <div className="mt-3 h-[75svh] w-full overflow-y-auto px-2">
        {isLoading && <CurrencySelectorSkeleton count={6} />}

        {walletNFTs?.map((nft) => (
          <button
            type="button"
            key={nft.name}
            className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
          >
            <div className="flex w-full items-center justify-between p-5 pl-0">
              <div className="flex items-center gap-2">
                <object data="https://stackoverflow.com/does-not-exist.png" type="image/png">
                  <img src={nft.metadata?.image} className="mt-1 h-20 w-20 rounded-xl bg-slate-500 " alt={nft.name} />
                </object>

                <div>
                  <p className="text-xl">{nft.name}</p>
                  <p className="text-xs">{nft.metadata?.name}</p>
                  <p className="text-xs">{nft.symbol}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelectorNFTs;

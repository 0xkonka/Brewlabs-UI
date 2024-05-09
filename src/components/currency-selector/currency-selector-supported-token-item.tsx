import MarketPrice24h from "components/MarketPrice24h";

import { useMarketData } from "@hooks/useMarketData";
import { useActiveChainId } from "@hooks/useActiveChainId";

import { Token } from "@brewlabs/sdk";
import type { Erc20Token } from "moralis/common-evm-utils";

type CurrencySelectorSupportedTokensProps = {
  token: Erc20Token;
  onCurrencySelect: (token: Token, tokenPrice: number) => void;
  supportedDisabled?: boolean;
};

const CurrencySelectorSupportedTokenItem = ({
  token,
  onCurrencySelect,
  supportedDisabled,
}: CurrencySelectorSupportedTokensProps) => {
  const { chainId } = useActiveChainId();

  // Get the token price
  // Will retrieve cached value if available
  const { data: tokenPrice } = useMarketData({ chain: chainId, address: token.contractAddress.lowercase });

  // Convert WalletTokensFromMoralis to Token
  const asToken = (currency: Erc20Token): Token => {
    return new Token(
      chainId,
      currency.contractAddress.lowercase,
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
      disabled={supportedDisabled}
      key={token.contractAddress.lowercase}
      onClick={() => onCurrencySelect(asToken(token), tokenPrice.usd)}
      className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
    >
      <div className="flex w-full items-center justify-between p-5 pl-0">
        <div className="flex gap-3">
          <div className="relative">
            <img
              className="mt-1 h-auto w-10 rounded-full bg-slate-500/10"
              src={token.logo}
              alt={token.name}
              width={40}
              height={40}
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
      </div>
    </button>
  );
};

export default CurrencySelectorSupportedTokenItem;

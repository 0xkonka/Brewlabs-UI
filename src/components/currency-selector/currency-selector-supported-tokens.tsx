import MarketPrice24h from "components/MarketPrice24h";

import { useMarketData } from "@hooks/useMarketData";
import { useActiveChainId } from "@hooks/useActiveChainId";

import type { Erc20Token } from "moralis/common-evm-utils";

const CurrencySelectorSupportedTokens = ({ token: { token } }: { token: { token: Erc20Token } }) => {
  const { chainId } = useActiveChainId();

  // Get the token price
  // Will retrieve cached value if available
  const { data: tokenPrice } = useMarketData({ chain: chainId, address: token.contractAddress.lowercase });

  console.log(tokenPrice);

  return (
    <button
      type="button"
      disabled={true}
      key={token.contractAddress.lowercase}
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

export default CurrencySelectorSupportedTokens;

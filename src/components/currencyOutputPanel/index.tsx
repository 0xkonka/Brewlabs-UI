import { Currency, CurrencyAmount } from "@brewlabs/sdk";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import BigNumber from "bignumber.js";
import { EXPLORER_URLS } from "config/constants/networks";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenMarketChart, { defaultMarketData } from "hooks/useTokenMarketChart";
import NumericalInput from "./NumericalInput";
import TradeCard from "./TradeCard";
import CurrencySelectButton from "components/CurrencySelectButton";

interface CurrencyOutputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  label?: string;
  currency?: Currency | null;
  balance: CurrencyAmount | undefined;
  data?: any;
  slippage?: number;
  price?: any;
  buyTax?: number;
  sellTax?: number;
  verified: boolean;
}

const CurrencyOutputPanel = ({
  value,
  onUserInput,
  label,
  currency,
  balance,
  data,
  slippage,
  price,
  buyTax,
  sellTax,
  verified,
}: CurrencyOutputPanelProps) => {
  const { chainId } = useActiveWeb3React();
  const tokenAddress = currency?.wrapped?.address?.toLowerCase();
  const tokenMarketData = useTokenMarketChart([tokenAddress], chainId);
  const { usd: tokenPrice, usd_24h_change: priceChange24h } = tokenMarketData[tokenAddress] || defaultMarketData;

  return (
    <>
      <div className="px-4 py-2 sm:ml-2 lg:ml-6">
        <div>{label}</div>
        <div className="mt-1 overflow-hidden">
          <div className="flex justify-between">
            <NumericalInput
              value={value}
              onUserInput={(val) => {
                onUserInput(val);
              }}
              decimals={currency?.decimals}
            />
            <CurrencySelectButton inputCurrencySelect={false} />
          </div>
          <div className="flex justify-between">
            <div className="ml-1 text-sm opacity-40">
              {value && tokenPrice ? new BigNumber(value).times(tokenPrice).toFixed(2) : "0.00"} USD
            </div>
            {currency && (
              <div className="ml-1">
                <div className="flex items-center justify-end">
                  <div className="mr-2 text-sm opacity-40">Balance: {balance ? balance.toSignificant(6) : "0.00"}</div>
                  <a
                    href={`${EXPLORER_URLS[chainId]}/token/${currency?.wrapped?.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src="/images/explorer/etherscan.png" alt="" className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        {priceChange24h && (
          <div className="ml-1 flex items-center gap-1 text-sm opacity-40">
            {priceChange24h > 0 ? (
              <>
                {priceChange24h.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3 dark:text-primary" />
              </>
            ) : (
              <>
                {Math.abs(priceChange24h).toFixed(3)}% <ArrowTrendingDownIcon className="h-3 w-3 dark:text-danger" />
              </>
            )}
            24HR
          </div>
        )}
      </div>
      {data && Object.keys(data).length ? (
        <div className="mx-6 mt-3 mb-2">
          <TradeCard
            data={data}
            slippage={slippage}
            price={price}
            buyTax={buyTax}
            sellTax={sellTax}
            verified={verified}
          />
        </div>
      ) : null}
    </>
  );
};

export default CurrencyOutputPanel;

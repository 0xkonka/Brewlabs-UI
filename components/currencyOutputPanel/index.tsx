import { Currency, CurrencyAmount, Pair } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { useTranslation } from "contexts/localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenPrice from "hooks/useTokenPrice";
import useCoingeckoTokenId from "hooks/useCoingeckoTokenId";
import useTokenMarketChart from "hooks/useTokenMarketChart";

import { ChevronDownIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

import { EXPLORER_URLS } from "config/constants/networks";

import Card from "../../views/swap/components/Card";
import NumericalInput from "./NumericalInput";
import TradeCard from "./TradeCard";
import { CurrencyLogo } from "../logo";

interface CurrencyOutputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  label?: string;
  onOpenCurrencySelect: () => void;
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
  onOpenCurrencySelect,
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
  const coingeckoId = useCoingeckoTokenId(currency?.symbol);
  const { priceChange24h, tokenPrice } = useTokenMarketChart(coingeckoId);

  return (
    <Card>
      <div className="ml-6">
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
            <div className="flex cursor-pointer items-center justify-end" onClick={onOpenCurrencySelect}>
              {currency ? (
                <span className="flex items-center justify-between text-2xl">
                  <CurrencyLogo currency={currency} size="24px" style={{ marginRight: "8px" }} />
                  {currency?.symbol}
                </span>
              ) : (
                <button className="h-full rounded-xl bg-primary px-2.5 py-1.5 text-black hover:bg-primary/75">
                  Select Token
                </button>
              )}
              <ChevronDownIcon className="ml-2 mb-1 h-5 w-5 dark:text-primary" />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="ml-1 text-sm opacity-40">
              {value && tokenPrice ? new BigNumber(value).times(tokenPrice).toFixed(2) : "0.00"} USD
            </div>
            {currency && (
              <div className="ml-1">
                <div className="flex items-center justify-end">
                  <div className="mr-2 text-sm opacity-40">Balance: {balance ? balance.toSignificant(6) : "0.00"}</div>
                  <a href={`${EXPLORER_URLS[chainId]}/token/${currency?.wrapped?.address}`} target="_blank" rel="noreferrer">
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
                {Math.abs(priceChange24h).toFixed(3)}% <ArrowTrendingDownIcon className="h-3 w-3 dark:text-warning" />
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
    </Card>
  );
};

export default CurrencyOutputPanel;

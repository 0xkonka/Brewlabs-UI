import { Currency, CurrencyAmount, Pair } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { useTranslation } from "contexts/localization";
import useTokenPrice from "hooks/useTokenPrice";

import { ChevronDownIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import Card from "../../views/swap/components/Card";
import NumericalInput from "./NumericalInput";
import TradeCard from "./TradeCard";
import { CurrencyLogo } from "../logo";
import useCoingeckoTokenId from "hooks/useCoingeckoTokenId";
import useTokenPriceChange from "hooks/useTokenPriceChange";

interface CurrencyOutputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  label?: string;
  onCurrencySelect: (currency: Currency) => void;
  currency?: Currency | null;
  balance: CurrencyAmount | undefined;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  data?: any;
  slippage?: number;
  price?: any;
  basePrice?: any;
  quotePrice?: any;
  buyTax?: number;
  sellTax?: number;
  verified: boolean;
}

const CurrencyOutputPanel = ({
  value,
  onUserInput,
  onMax,
  label,
  onCurrencySelect,
  currency,
  balance,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  data,
  slippage,
  price,
  basePrice,
  quotePrice,
  buyTax,
  sellTax,
  verified,
}: CurrencyOutputPanelProps) => {
  const tokenPrice = useTokenPrice(currency?.chainId, currency?.wrapped?.address);
  const coingeckoId = useCoingeckoTokenId(currency?.symbol);
  const priceChange24h = useTokenPriceChange(coingeckoId);
  const { t } = useTranslation();

  return (
    <Card>
      <div className="ml-6">
        <div>{label}</div>
        <div className="mt-1 flex justify-between">
          <div>
            <NumericalInput
              value={value}
              onUserInput={(val) => {
                onUserInput(val);
              }}
              decimals={currency?.decimals}
            />
            <div className="ml-1 text-sm opacity-40">
              {value ? new BigNumber(value).times(tokenPrice).toFixed(2) : "0.00"} USD
            </div>
            {priceChange24h && (
              <div className="ml-1 flex items-center text-sm opacity-40 gap-1">
                {priceChange24h > 0 ? (
                  <>
                    {priceChange24h.toFixed(3)}% <ArrowTrendingUpIcon className="h-3 w-3 dark:text-primary" />
                  </>
                ) : (
                  <>
                    {Math.abs(priceChange24h).toFixed(3)}%{" "}
                    <ArrowTrendingDownIcon className="h-3 w-3 dark:text-warning" />
                  </>
                )}
                24HR
              </div>
            )}
          </div>
          <div className="flex justify-start" style={{ minWidth: "140px" }}>
            <div className="w-full">
              <div className="flex justify-between">
                {currency ? (
                  <span className="flex items-center justify-between text-2xl">
                    <CurrencyLogo currency={currency} size="24px" style={{ marginRight: "8px" }} />
                    {currency?.symbol}
                  </span>
                ) : (
                  <button className="h-3/5 rounded-xl bg-primary px-2.5 py-1.5 text-black hover:bg-primary/75">
                    Select Token
                  </button>
                )}
                <ChevronDownIcon className="ml-2 mt-1 h-5 w-5 dark:text-primary" />
              </div>
              {currency && (
                <div className="ml-1">
                  <div className="flex items-center">
                    <div className="mr-2 text-sm opacity-40">
                      {balance ? balance.toFixed(2) : "0.00"}&nbsp;{currency?.symbol}
                    </div>
                    <a href="#">
                      <img src="/images/explorer/etherscan.png" alt="" className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-6 mt-3 mb-2">
        {data && Object.keys(data).length ? (
          <TradeCard
            data={data}
            slippage={slippage}
            price={price}
            basePrice={basePrice}
            quotePrice={quotePrice}
            buyTax={buyTax}
            sellTax={sellTax}
            verified={verified}
          />
        ) : null}
      </div>
    </Card>
  );
};

export default CurrencyOutputPanel;

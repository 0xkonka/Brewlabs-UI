import React, { useEffect, useMemo, useState } from "react";
import { formatUnits } from "ethers/lib/utils";

import {
  ChevronDownIcon,
  ExclamationCircleIcon,
  BoltIcon,
  LockClosedIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useCurrency } from "hooks/Tokens";
import { tryParseAmount } from "state/swap/hooks";
import { BigNumber } from "ethers";
import { useTranslation } from "contexts/localization";
import { formatDecimals } from "utils/formatBalance";

const ETHER_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

interface TradeCardProps {
  data: any;
  slippage: number;
  price: any;
  buyTax?: number;
  sellTax?: number;
  verified: boolean;
}

const TradeCard: React.FC<TradeCardProps> = ({
  data,
  slippage,
  price,
  buyTax,
  sellTax,
  verified,
}) => {
  const { t } = useTranslation();

  const [priceInverted, setPriceInverted] = useState<boolean>(false);
  const [tradePanelToggled, setTradePanelToggled] = useState<boolean>(undefined);
  const customConditionMatched = useMemo(() => verified && slippage, [verified, slippage]);

  const currency = useCurrency(data.toToken.address === ETHER_ADDRESS ? "ETH" : data.toToken.address);
  const minAmount = BigNumber.from(data.toTokenAmount)
    .mul(10000 - slippage)
    .div(10000);
  const formattedMinAmount = formatUnits(minAmount, data.toToken.decimals);
  const minCurrencyAmount = tryParseAmount(formattedMinAmount, currency);
  const minimumReceived = Number(minCurrencyAmount?.toExact());

  useEffect(() => {
    if (!price) setTradePanelToggled(undefined);
  }, [price]);

  const formattedPrice = formatDecimals(price?.toSignificant(6) ?? "0.0");
  const formattedInvertedPrice = formatDecimals(price?.invert()?.toSignificant(6) ?? "0.0");

  return (
    <>
      {price ? (
        <div className="rounded-xl border border-amber-300 px-2 py-1">
          <div className="mr-2 flex cursor-pointer justify-between">
            <div className="flex items-center gap-1" style={{ marginRight: "4px" }}>
              <ExclamationCircleIcon className="h-5 w-5 dark:text-primary" data-tooltip-target="tooltip-default" />
              {!tradePanelToggled}
              <p className="text-[13px]" onClick={() => setPriceInverted(!priceInverted)}>
                {priceInverted ? (
                  formattedPrice.includes("sub") ? (
                    <>
                      1 {price.baseCurrency.symbol} = 0.0
                      <span style={{ fontSize: "11px" }}>
                        <sub>{formattedPrice[3] === "0" ? formattedPrice[9] : formattedPrice.slice(8, 10)}</sub>
                      </span>
                      {formattedPrice.slice(16)} {price.quoteCurrency.symbol}
                    </>
                  ) : (
                    `1 ${price.baseCurrency.symbol} = ${formattedPrice} ${price.quoteCurrency.symbol}`
                  )
                ) : formattedInvertedPrice.includes("sub") ? (
                  <>
                    1 {price.quoteCurrency.symbol} = 0.0
                    <span style={{ fontSize: "11px" }}>
                      <sub>
                        {formattedInvertedPrice[3] === "0"
                          ? formattedInvertedPrice[9]
                          : formattedInvertedPrice.slice(8, 10)}
                      </sub>
                    </span>
                    {formattedInvertedPrice.slice(16)} {price.baseCurrency.symbol}
                  </>
                ) : (
                  `1 ${price.quoteCurrency.symbol} = ${formattedInvertedPrice} ${price.baseCurrency.symbol}`
                )}
              </p>
            </div>
            <div
              className="flex items-center gap-2 hover:opacity-70"
              onClick={() => setTradePanelToggled(!tradePanelToggled)}
            >
              <button className="hidden rounded rounded-2xl bg-primary px-3 text-xs text-black sm:block">
                {data.protocols[0][0][0].name.split("_")[0]}
              </button>
              <ChevronDownIcon className="h-4 w-4 dark:text-primary" />
            </div>
          </div>
          {tradePanelToggled ? (
            <div className="mt-1 flex justify-between">
              <div className="min-w-[190px]">
                {customConditionMatched ? (
                  <span className="mb-2 flex max-w-fit items-center gap-1 rounded-2xl border border-green px-2">
                    <BoltIcon className="h-3 w-3 dark:text-green" />
                    <p className="text-[13px]">Custom conditions</p>
                  </span>
                ) : (
                  <span className="mb-2 flex max-w-fit items-center gap-1 rounded-2xl border border-amber-300 px-2">
                    <BoltIcon className="h-3 w-3 dark:text-primary" />
                    <p className="text-[13px]">Custom conditions</p>
                  </span>
                )}
                <div className="ml-1">
                  <span className="flex justify-between">
                    <p className="text-[11px]">
                      <span className="text-primary">Buy</span>&nbsp;tax
                    </p>
                    <p className="text-[11px]">{buyTax ? `${buyTax}%` : "-"}</p>
                  </span>
                  <span className="flex justify-between">
                    <p className="text-[11px]">
                      <span className="text-primary">Sell</span>&nbsp;tax
                    </p>
                    <p className="text-[11px]">{sellTax ? `${sellTax}%` : "-"}</p>
                  </span>
                  <span className="flex justify-between">
                    <p className="text-[11px]">{t("Minimum Received")}</p>
                    <p className="text-[11px]">
                      {minimumReceived > 1
                        ? formatDecimals(Math.floor(minimumReceived).toString())
                        : formatDecimals(minCurrencyAmount?.toSignificant())}
                      &nbsp;
                      {data.toToken.symbol}
                    </p>
                  </span>
                  <span className="flex items-center justify-start gap-1">
                    <LockClosedIcon className="h-3 w-3 dark:text-green" />
                    <p className="text-[11px]">Liquidity Locked</p>
                  </span>
                  <span className="flex items-center justify-start gap-1">
                    {verified ? (
                      <BeakerIcon className="h-3 w-3 dark:text-green" />
                    ) : (
                      <ExclamationTriangleIcon className="h-3 w-3 dark:text-warning" />
                    )}
                    <p className="text-[11px]">Brewlabs Verified</p>
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default TradeCard;

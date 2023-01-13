import { Currency, CurrencyAmount, Pair, Price, TokenAmount } from "@brewlabs/sdk";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import BigNumber from "bignumber.js";

import { EXPLORER_URLS } from "config/constants/networks";
import { useTranslation } from "contexts/localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenPrice from "hooks/useTokenPrice";

import Card from "../../views/swap/components/Card";
import NumericalInput from "./NumericalInput";
import { CurrencyLogo } from "../logo";

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onOpenCurrencySelect: () => void;
  currency?: Currency | null;
  balance: CurrencyAmount | undefined;
}

const CurrencyInputPanel = ({
  value,
  onUserInput,
  onMax,
  label,
  onOpenCurrencySelect,
  currency,
  balance,
}: CurrencyInputPanelProps) => {
  const { account, chainId } = useActiveWeb3React();
  const tokenPrice = useTokenPrice(currency?.chainId, currency?.wrapped?.address);
  const { t } = useTranslation();

  return (
    <>
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
              <div className="flex cursor-pointer justify-end items-center" onClick={onOpenCurrencySelect}>
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
                    <div className="mr-2 cursor-pointer text-sm opacity-40 hover:opacity-80" onClick={onMax}>
                      Balance: {balance ? balance.toSignificant(6) : "0.00"}
                    </div>
                    <a href={`${EXPLORER_URLS[chainId]}/token/${currency?.wrapped?.address}`} target="_blank" rel="noreferrer">
                      <img src="/images/explorer/etherscan.png" alt="" className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CurrencyInputPanel;

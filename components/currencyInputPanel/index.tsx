import { Currency, CurrencyAmount, Pair, TokenAmount } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import { AppId } from "config/constants/types";
import { useTranslation } from "contexts/localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useTokenPrice from "hooks/useTokenPrice";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import CurrencySearchModal from "components/searchModal/CurrencySearchModal";
import Card from "../../views/swap/components/Card";
import NumericalInput from "./NumericalInput";
import { CurrencyLogo } from "../logo";
interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
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
  isZap?: boolean;
  appId?: AppId;
  onClickSelect?: () => void;
}

const CurrencyInputPanel = ({
  value,
  onUserInput,
  onMax,
  showMaxButton,
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
  isZap,
  appId,
  onClickSelect,
}: CurrencyInputPanelProps) => {
  const { account } = useActiveWeb3React();
  const tokenPrice = useTokenPrice(currency?.chainId, currency?.wrapped?.address);
  const { t } = useTranslation();

  return (
    <>
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
                    <button
                      className="rounded-lg border border-amber-300 px-6 text-xs hover:opacity-60"
                      onClick={onMax}
                    >
                      Max
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      <CurrencySearchModal
        open={false}
        onDismiss={() => {}}
        onCurrencySelect={onCurrencySelect}
        selectedCurrency={currency}
        otherSelectedCurrency={otherCurrency}
        showCommonBases={showCommonBases}
      ></CurrencySearchModal>
    </>
  );
};

export default CurrencyInputPanel;

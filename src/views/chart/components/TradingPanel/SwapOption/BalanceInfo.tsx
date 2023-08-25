import { SkeletonComponent } from "@components/SkeletonComponent";
import { ChevronDownSVG, CopySVG, RefreshSVG } from "@components/dashboard/assets/svgs";
import TokenLogo from "@components/logo/TokenLogo";
import { useTokenTaxes } from "@hooks/useTokenInfo";
import { useState } from "react";
import { isAddress } from "utils";
import { BigNumberFormat } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

export default function BalanceInfo({ currency, balances, price, lpPrice }) {
  const [switchBalance, setSwitchBalance] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const balance = currency
    ? switchBalance
      ? balances && balances[currency.chainId]
        ? balances[currency.chainId][1].balance
        : 0
      : balances && balances[currency.chainId]
      ? balances[currency.chainId][0].balance
      : 0
    : 0;

  const symbol = currency
    ? switchBalance
      ? `${currency.symbols[0]}-${currency.symbols[1]}`
      : currency.symbols[0]
    : "";

  const onCopyAddress = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(switchBalance ? currency.address : currency.tokenAddresses[0]);
  };

  return (
    <div className="primary-shadow mt-2 flex w-[320px] items-center justify-between rounded-[6px] bg-[#B9B8B80D] p-3">
      <div className="flex cursor-pointer items-center" onClick={() => setSwitchBalance(!switchBalance)}>
        <div className={`mr-2 text-white ${switchBalance ? "-scale-y-100" : ""}`}>{ChevronDownSVG}</div>
        <TokenLogo
          src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
          classNames="primary-shadow h-8 w-8 rounded-full"
        />

        <div className="ml-2">
          <div className="text-sm leading-none text-white">
            {BigNumberFormat(balance)} {symbol} Balance
          </div>
          <div className="mt-0.5 text-xs leading-none text-[#FFFFFF80]">
            {BigNumberFormat(balance * (switchBalance ? lpPrice : price))} USD
          </div>
        </div>
      </div>
      <div
        className={`cursor-pointer ${
          isCopied ? "!text-[#FFFFFFBF]" : "text-tailwind"
        } text-sm hover:text-white [&>svg]:!h-4 [&>svg]:!w-4`}
        onClick={() => onCopyAddress()}
      >
        {isCopied ? "Copied" : CopySVG}
      </div>
    </div>
  );
}

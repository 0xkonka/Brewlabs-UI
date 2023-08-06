import SwapPanel from "views/swap/SwapPanel";
import { useContext, useState } from "react";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import { DashboardContext } from "contexts/DashboardContext";
import { BigNumberFormat } from "utils/functions";
import TokenLogo from "@components/logo/TokenLogo";
import { CopySVG, PlusSVG, checkCircleSVG } from "@components/dashboard/assets/svgs";
import VolumeInfo from "./VolumeInfo";
import SlippageInfo from "./SlippageInfo";
import useTokenBalances from "@hooks/useTokenMultiChainBalance";
import { useAccount } from "wagmi";
import useTokenMarketChart from "@hooks/useTokenMarketChart";
import useTokenInfo from "@hooks/useTokenInfo";

export default function SwapOption({ currency, marketInfos }) {
  const [isCopied, setIsCopied] = useState(false);

  const { address: account } = useAccount();
  // const account = "0x330518cc95c92881bCaC1526185a514283A5584D";
  const { decimals } = useTokenInfo(currency.tokenAddresses[0], currency.chainId);

  const { balances } = useTokenBalances(
    { [currency.chainId]: [{ address: currency.tokenAddresses[0], decimals }] },
    { [currency.chainId]: [account] }
  );

  const prices = useTokenMarketChart(currency.chainId);

  const onCopyAddress = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(currency.tokenAddresses[0]);
  };

  return (
    <div className="flex w-fit flex-col sm:w-full sm:flex-row 2xl:sm:flex-col">
      <div className="primary-shadow flex h-fit w-[320px] flex-col gap-1 rounded-[6px] bg-[#B9B8B80D] p-3 2xl:w-full">
        <SwapPanel showHistory={false} />
      </div>
      <div className="ml-0 mt-0 w-[320px] flex-1 sm:ml-4 sm:w-fit 2xl:sm:ml-0 2xl:mt-2 2xl:flex-none">
        {/* <SlippageInfo currency={currency} /> */}
        {/* <div className="mt-2" /> */}
        <VolumeInfo currency={currency} />
        <div className="primary-shadow mt-2 flex w-[320px] items-center justify-between rounded-[6px] bg-[#B9B8B80D] p-3">
          <div className="flex items-center">
            <TokenLogo
              src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
              classNames="primary-shadow h-8 w-8 rounded-full"
            />

            <div className="ml-2">
              <div className="text-sm leading-none text-white">
                {BigNumberFormat(balances && balances[currency.chainId] ? balances[currency.chainId][0].balance : 0)}{" "}
                {currency.symbols[0]} Balance
              </div>
              <div className="mt-0.5 text-xs leading-none text-[#FFFFFF80]">
                {balances && balances[currency.chainId]
                  ? BigNumberFormat(
                      balances[currency.chainId][0].balance *
                        (prices[currency.tokenAddresses[0].toLowerCase()]
                          ? prices[currency.tokenAddresses[0].toLowerCase()].usd
                          : 0)
                    )
                  : 0}{" "}
                USD
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
        <div>
          <div className="primary-shadow mt-2 w-full rounded-[6px] bg-[#B9B8B80D] p-3 text-[#FFFFFFBF]">
            <div>Description</div>
            <div className="line-clamp-[7] overflow-hidden text-ellipsis text-xs">{marketInfos?.info?.description}</div>
          </div>
          <div className="mt-2 flex justify-end text-[#FFFFFFBF]">
            <div className="mr-2.5 flex cursor-pointer items-center text-xs hover:text-white">
              <div className="-mt-1 mr-1 text-tailwind">{PlusSVG}</div>
              <div>UPDATE DETAILS</div>
            </div>
            <div className="flex cursor-pointer items-center text-xs hover:text-white">
              <div className="-mt-1 mr-1 text-tailwind">{PlusSVG}</div>
              <div>ADD COMMUNITY</div>
            </div>
          </div>
        </div>
      </div>
      <div className={`mb-4 mt-4 hidden h-[120px] rounded-lg bg-[url('/images/directory/truenft.png')] 2xl:block`} />
    </div>
  );
}

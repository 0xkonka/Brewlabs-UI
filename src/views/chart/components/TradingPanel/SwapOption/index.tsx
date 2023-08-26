import SwapPanel from "views/swap/SwapPanel";
import { useContext } from "react";
import VolumeInfo from "./VolumeInfo";
import { SwapContext } from "contexts/SwapContext";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import SlippageInfo from "./SlippageInfo";
import VotePanel from "./VotePanel";
import Security from "@components/SwapComponents/Security";
import SlippageText from "@components/SwapComponents/SlippageText";
import BalanceInfo from "./BalanceInfo";
import Socials from "./Socials";
import MomentumInfo from "./MomentumInfo";

export default function SwapOption({ currency, marketInfos, volumeDatas, balances, lpPrice, price }) {
  const { setOpenSettingModal }: any = useContext(SwapContext);

  return (
    <div className="flex w-fit flex-col sm:w-full sm:flex-row 2xl:sm:flex-col">
      <div className="primary-shadow relative flex h-fit w-[320px] flex-col gap-1 rounded-[6px] bg-[#B9B8B80D] p-3 2xl:w-full">
        <div className="mb-1 flex items-center justify-between">
          <Security />
          <div className="flex items-center">
            <SlippageText />
            <div onClick={() => setOpenSettingModal(true)} className="ml-1">
              <Cog8ToothIcon className="h-5 w-5 cursor-pointer hover:animate-spin dark:text-primary" />
            </div>
          </div>
        </div>
        <SwapPanel showHistory={false} size="sm" toChainId={currency?.chainId} />
      </div>
      <div className="ml-0 mt-0 w-[320px] flex-1 sm:ml-4 2xl:sm:ml-0 2xl:mt-2 2xl:flex-none">
        {currency ? <SlippageInfo currency={currency} /> : ""}
        <div className="mt-2" />
        <VolumeInfo volumeDatas={volumeDatas} />
        <MomentumInfo volumeDatas={volumeDatas} />
        {currency ? <BalanceInfo currency={currency} price={price} lpPrice={lpPrice} balances={balances} /> : ""}
        {currency ? <Socials currency={currency} marketInfos={marketInfos} /> : ""}
        {currency ? <VotePanel currency={currency} /> : ""}
      </div>

      <div className={`mb-4 mt-4 hidden h-[120px] rounded-lg bg-[url('/images/directory/truenft.png')] 2xl:block`} />
    </div>
  );
}

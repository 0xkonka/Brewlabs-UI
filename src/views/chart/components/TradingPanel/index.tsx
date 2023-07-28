import TradingViewChart from "./TradingViewChart";
import FavouritePanel from "./FavouritePanel";
import SwapHistory from "./SwapHistory";
import SwapOption from "./SwapOption";

export default function TradingPanel({ currency, marketInfos }) {
  return (
    <div className="mt-6">
      <div className="flex">
        <div className="hidden w-[320px] 2xl:block">
          <SwapOption currency={currency} marketInfos={marketInfos} />
        </div>
        <div className="mx-0 flex-1 2xl:mx-4">
          <div className="h-[600px]">
            <TradingViewChart currency={currency} />
          </div>
          <SwapHistory currency={currency} />
        </div>
        <div className="hidden w-[280px] 2xl:block">
          <FavouritePanel />
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between sm:items-start xl:flex-row 2xl:hidden">
        <div className="mr-0 flex-1 xl:mr-4">
          <SwapOption currency={currency} marketInfos={marketInfos} />
        </div>
        <div className="mt-6 w-full max-w-[300px] xl:mt-0">
          <FavouritePanel />
        </div>
      </div>
    </div>
  );
}

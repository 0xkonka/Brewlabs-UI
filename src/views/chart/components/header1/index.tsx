import { DeployerSVG } from "@components/dashboard/assets/svgs";
import CurrencySelectButton from "./CurrencySelectButton";
import { SearchInput } from "./SearchInput";
import TrendingSelector from "./TrendingSelector";
import { CakeSelector } from "./CakeSelector";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";
import { SwitchHorizontal } from "@components/dashboard/assets/svgs";

export default function Header1() {
  const { showFavorite, setShowFavorite, tokenData }: any = useContext(ChartContext);

  return (
    <div className="flex flex-wrap items-center justify-start gap-1.5">
      <div className="mr-1.5 flex flex-col justify-end">
        <div className="flex items-center">
          {DeployerSVG}
          <p className="text-[40px] !text-[#EEBB19]">BrewCharts</p>
        </div>
        <div className="flex justify-end text-[8px] leading-[9px] text-white max-[480px]:text-[12px]">Beta 1.0.0</div>
      </div>
      <div className="mr-3 flex flex-wrap items-center gap-3">
        <CurrencySelectButton />
        <SearchInput />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <TrendingSelector />
        <CakeSelector />
        <div className="max-[700px]:hidden">
          <button
            onClick={() => {
              setShowFavorite(!showFavorite);
            }}
          >
            {SwitchHorizontal}
          </button>
        </div>
      </div>
    </div>
  );
}

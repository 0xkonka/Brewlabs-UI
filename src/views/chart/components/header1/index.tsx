import { DeployerSVG } from "@components/dashboard/assets/svgs";
import CurrencySelectButton from "./CurrencySelectButton";
import { SearchInput } from "./SearchInput";
import TrendingSelector from "./TrendingSelector";
import { CakeSelector } from "./CakeSelector";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";
import { SwitchHorizontal } from "@components/dashboard/assets/svgs"

export default function Header1() {
    const {
        showFavorite,
        setShowFavorite,
        tokenData
    }: any = useContext(ChartContext);

    return (
        <div className="flex items-center flex-wrap justify-start gap-1.5">
            <div className="flex flex-col justify-end mr-1.5">
                <div className="flex items-center">
                    <DeployerSVG height="28px" fill="#EEBB19"/>
                    <p className="!text-[#EEBB19] text-[40px]">BrewCharts</p>
                </div>
                <div className="flex justify-end text-white text-[8px] leading-[9px] max-[480px]:text-[12px]">Beta 1.0.0</div>
            </div>
            <div className="flex items-center flex-wrap gap-3 mr-3">
                <CurrencySelectButton/>
                <SearchInput />
            </div>
            <div className="gap-3 flex items-center flex-wrap">
                <TrendingSelector />
                <CakeSelector />
                <div className="max-[700px]:hidden">
                    <button onClick={() => {setShowFavorite(!showFavorite)}}>
                        {SwitchHorizontal}
                    </button>
                </div>
            </div>
        </div>
    );
  }
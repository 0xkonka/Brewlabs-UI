import Detail from "./Detail"
import PriceTrend from "./PriceTrend"
import { Star } from "./Star"
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";

export default function Header2() {
    const {
        showFavorite,
    }: any = useContext(ChartContext);
    return (
    <div className="flex items-center flex-wrap justify-between mt-[4px] gap-3 max-[700px]:justify-center max-[480px]:text-[12px] max-[480px]:mt-5 max-[480px]:text-[12px] max-[480px]:gap-4">
        <div className="flex flex-wrap justify-end max-[1024px]:flex-col max-[1024px]:justify-center max-[1275px]:justify-start max-[480px]:gap-4">
            <Star />
            <Detail />
        </div>
        <div className={`flex justify-end max-[1024px]:mr-0 ${showFavorite && "mr-[289px] max-[1700px]:mr-[20px]"}`}>
            <PriceTrend />
        </div>
    </div>
    )
}
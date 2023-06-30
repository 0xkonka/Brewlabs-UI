import { TrendingDown, TrendingUp } from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";


export default function PriceTrend () {
    const {
        tokenData,
        pairData
    }: any = useContext(ChartContext);

    return (
        <div className="flex justify-center items-center">
            <div className="flex gap-2 text-[10px] leading-[12px] text-[500] items-center text-[#2FD35D]">
                {pairData && pairData.data.price24h && ((pairData.data.price - pairData.data.price24h.priceChain) / pairData.data.price * 100).toFixed(2)}%(24h)
                <div className="ml-[1px] mr-[6px]">{pairData && pairData.data.price24h && (pairData.data.price > pairData.data.price24h.priceChain ? TrendingUp : TrendingDown)}</div>
            </div>
            <p className="flex items-center text-[20px] leading-[23px] font-[900] text-white">${pairData && pairData.data.price.toString().substring(0, 9)}</p>
        </div>
    )
}
import { DBSVG, ChartSVG, TagSVG, GraphSVG } from "@components/dashboard/assets/svgs"
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";

export default function Detail () {
    const {
        tokenData,
        pairData
    }: any = useContext(ChartContext);
    return(
        <div className="flex flex-wrap justify-center items-center gap-1.5 max-[480px]:gap-4 pl-[14px]">
            <div className="flex gap-2 items-center">
                <button><DBSVG color="#3F3F46"/></button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">
                    {pairData && pairData.data.metrics.liquidity.toFixed(2)} Pool liquidity
                </p>
            </div>
            <div className="flex gap-2 items-center">
                <button>{ChartSVG}</button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">
                    {pairData && (pairData.data.metrics.liquidity * pairData.data.price).toFixed(2)} Market cap
                </p>
            </div>
            <div className="flex gap-2 items-center">
                <button>{TagSVG}</button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">
                    {tokenData && tokenData.data.metrics.holders} Holders
                </p>
            </div>
            <div className="flex gap-2 items-center">
                <button>{GraphSVG}</button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">
                    {pairData && pairData.data.price24h.volume.toFixed(2)} Volume(24h)
                </p>
            </div>
        </div>
    )
}
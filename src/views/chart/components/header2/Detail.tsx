import { DBSVG, ChartSVG, TagSVG, GraphSVG } from "@components/dashboard/assets/svgs"

export default function Detail () {
    return(
        <div className="flex flex-wrap justify-center items-center gap-1.5 max-[480px]:gap-4 pl-[14px]">
            <div className="flex gap-2 items-center">
                <button><DBSVG color="#3F3F46"/></button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">273.82 Pool liquidity</p>
            </div>
            <div className="flex gap-2 items-center">
                <button>{ChartSVG}</button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">273.82 Pool liquidity</p>
                
            </div>
            <div className="flex gap-2 items-center">
                <button>{TagSVG}</button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">273.82 Pool liquidity</p>
            </div>
            <div className="flex gap-2 items-center">
                <button>{GraphSVG}</button>
                <p className="text-[10px] leading-[12px] text-[500] text-white max-[480px]:text-[14px] max-[1400px]:leading-[16px]">273.82 Pool liquidity</p>
            </div>
        </div>
    )
}
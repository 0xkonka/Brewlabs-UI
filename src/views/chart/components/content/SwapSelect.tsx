import { useState } from "react"
import styled from "styled-components";
import { CircleSVG } from "@components/dashboard/assets/svgs";
export default function SwapSelect() {
    const [mode, setMode] = useState(0);

    return (
        <div className="flex flex-wrap gap-[0.75rem] mt-[-6px] max-[700px]:flex-col max-[700px]:mt-[18px]">
            <div className="flex flex-wrap gap-[17px] max-[480px]:justify-center">
                <button className="flex items-center bg-[#28282B] rounded-[4px] pl-[9px] pr-[16px] pt-[7px] pb-[7px] h-[24px]" onClick={() => {setMode(0)}}>
                    <CircleSVG size="7" color={mode === 0 ? "#2FD35DBF" : "#FFFFFF80"} />
                    <p className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px]">Swaps(all)</p>
                </button>
                <button className="flex items-center bg-[#28282B] rounded-[4px] pl-[9px] pr-[16px] pt-[7px] pb-[7px] h-[24px]" onClick={() => {setMode(0)}}>
                    <CircleSVG size="7" color={mode === 1 ? "#2FD35DBF" : "#FFFFFF80"} />
                    <p className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px]">Swaps(Mine)</p>
                </button>
            </div>
            <div className="flex flex-wrap flex-1 bg-[#28282B] rounded-[4px] pl-[9px] pr-[16px] pt-[7px] pb-[7px] justify-between h-[24px] ">
                <p className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px]">Performance</p>
                <div className="flex flex-wrap items-center justify-between gap-[40px]">
                    <div className="flex gap-3">
                        <p className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px]">Swap Mode</p>
                        <p className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px]">4</p>
                    </div>
                    <div className="flex flex-wrap gap-[9px]">
                        <p className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px]">Total P/L</p>
                        <p  className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px] !text-[#2BA64E]">+58.32%</p>
                        <p  className="text-[10px] leading-[10px] font-[400] max-[480px]:tex-[14px] max-[480px]:leading-[14px] pl-[9px] !text-[#2BA64E]">$382.00 USD</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
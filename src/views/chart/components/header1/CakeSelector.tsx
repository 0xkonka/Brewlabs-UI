import { CircleSVG } from "@components/dashboard/assets/svgs";

export const CakeSelector = () => {
    return (
        <div className="flex flex-wrap flex-row items-center justify-center h-[50px] rounded-[120px] bg-[#18181B] pt-[20px] pb-[20px] pl-[9px] pr-[9px] drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)] max-[480px]:w-full gap-[6px]">
            {[1, 1, 1, 1, 1, 1].map((text, index) => (
                <div key={index} className="flex gap-[6px]">
                    <CircleSVG size="11px"/>
                    <p className="text-[10px] leading-[12px] font-[600]">CAKE</p>                
                </div>
            ))}
        </div>
    )
};
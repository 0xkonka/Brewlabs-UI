import { CircleSVG, StarSVG, LockSVG, CheckCircleSVG, ThumbUpSVG, ThumbDownSVG } from "@components/dashboard/assets/svgs"

export default function Star() {
    return (
        <div className="flex flex-wrap items-center justify-start gap-2 max-[700px]:justify-center max-[700px]:flex-col max-[480px]:gap-4">
            <div className="flex">
                <div className="flex items-center pr-[9px]">
                    <StarSVG color="#3F3F46" size="20px"/>
                </div>
                <div className="flex pr-[7px]">
                    <div className="flex items-center justify-center border-1 border-solid border-black">
                    <CircleSVG size="22"/>
                    </div>
                </div>
                <div className="flex pr-[13px]">
                    <div className="flex items-center justify-center border-1 border-solid border-black relative z-[2]">
                        <CircleSVG size="22"/>
                    </div>
                    <div className="flex items-center justify-center ml-2.5  border-1 border-solid border-black relative left-[-20px] z-[0]">
                        <CircleSVG size="22"/>
                    </div>
                    <div className="relative bottom-[6px] right-[30px]">
                        {LockSVG}
                    </div>
                </div>
                <div className="flex ml-[-30px] pr-[14px]">
                    <p className="mt-2 font-brand text-[20px] leading-[23px] text-[600] font-bold tracking-widest text-white z-[2]">BREWLABS-WBNB</p>
                    <div className="relative top-[6px] right-[10px] z-[0]">
                        <CheckCircleSVG/>
                    </div>
                </div>
            </div>
           
            <div className="flex">
                <div className="flex items-center justify-center gap-[3px] ml-[-30px] pl-[10px]">
                    {[1, 2, 3, 4, 5, 6].map((id) => (
                        <div className="flex items-center justify-center border-1 border-solid border-black">
                            <CircleSVG size="14"/>
                        </div>
                    ))}
                </div>
                <div className="flex ml-1.5 pl-[14px] justify-center gap-2">
                    <div className="flex items-center gap-[5px]">
                        <button>{ThumbUpSVG}</button>
                        <p className="text-[10px] leading-[12px] text-[500]">45</p>
                    </div>
                    <div className="flex items-center gap-[5px]">
                        <button>{ThumbDownSVG}</button>
                        <p className="text-[10px] leading-[12px] text-[500]">23</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
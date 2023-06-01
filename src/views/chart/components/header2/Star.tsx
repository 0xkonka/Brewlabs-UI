import { CircleSVG, StarSVG, LockSVG, CheckCircleSVG, ThumbUpSVG, ThumbDownSVG, WebSiteSVG, EmailSVG, TelegramSVG, TwitterSVG, DiscordSVG } from "@components/dashboard/assets/svgs"
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";

export default function Star() {
    const {
        tokenData,
        pairData
    }: any = useContext(ChartContext);
    
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
                    <p className="mt-2 font-brand text-[20px] leading-[23px] text-[600] font-bold tracking-widest text-white z-[2]">
                        {tokenData && tokenData.data.symbol}
                        -{pairData && pairData.data.tokenRef.symbol}
                    </p>
                    <div className="relative top-[6px] right-[10px] z-[0]">
                        <CheckCircleSVG/>
                    </div>
                </div>
            </div>
           
            <div className="flex">
                <div className="flex items-center justify-center gap-[6px] ml-[-30px] pl-[10px]">
                    <button className="flex items-center justify-center border-1 border-solid border-black"
                        onClick={() => {
                            if(tokenData)
                                window.open(tokenData.data.links.website, "_blank")
                            }}>
                        <WebSiteSVG color={tokenData && (tokenData.data.links.website.length > 0 ? '#fff' : '#3f3f46')}/>
                    </button>
                    <a className="flex items-center justify-center border-1 border-solid border-black" href={tokenData && `mailto:${tokenData.data.info.email}`}>
                        <EmailSVG color={tokenData && (tokenData.data.info.email.length > 0 ? '#fff' : '#3f3f46')}/>
                    </a>
                    <button className="flex items-center justify-center border-1 border-solid border-black"
                        onClick={() => {
                            if(tokenData)
                                window.open(tokenData.data.links.telegram, "_blank")
                        }}>
                        <TelegramSVG color={tokenData && (tokenData.data.links.telegram.length > 0 ? '#fff' : '#3f3f46')}/>
                    </button>
                    <button className="flex items-center justify-center border-1 border-solid border-black"
                        onClick={() => {
                            if(tokenData)
                                window.open(tokenData.data.links.twitter, "_blank")
                        }}>
                        <TwitterSVG color={tokenData && (tokenData.data.links.twitter.length > 0 ? '#fff' : '#3f3f46')}/>
                    </button>
                    <button className="flex items-center justify-center border-1 border-solid border-black cursor-pointer"
                        onClick={() => {
                            if(tokenData)
                                window.open(tokenData.data.links.discord, "_blank")
                        }}>
                        <DiscordSVG color={tokenData && (tokenData.data.links.discord.length > 0 ? '#fff' : '#3f3f46')}/>
                    </button>
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
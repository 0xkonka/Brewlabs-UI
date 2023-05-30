import styled from "styled-components";
import { CircleSVG, CloseCircle, ExternalLink, DBSVG, CheckCircleSVG } from "@components/dashboard/assets/svgs";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Nav () {
    return (
        <div className="flex flex-col w-[224px] gap-[9px] max-[1400px]:w-full max-[1400px]:p-4 max-[1400px]:max-w-full">
            <div className="flex max-[1400px]:w-full justify-between items-center p-[8px]  bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid border-[#58585a] rounded-[6px] h-[245px]"/>
            <div className="flex max-[1400px]:w-full justify-between items-center p-[8px]  bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid border-[#58585a] rounded-[6px]">
                <div className="flex items-center">
                    <CircleSVG size="22"/>
                    <div className="flex flex-col pl-2">
                        <p className="text-[12px] leading-[14px] max-[480px]:text-[14px] max-[480px]:leading-[16px] font-[500] justify-center">273.82k BREWLABS Balance</p>
                        <p className="text-[10px] leading-[12px] font-[500] max-[480px]:text-[12px] max-[1400px]:leading-[14px]">50,802.22 USD</p>
                    </div>
                </div>
                <button>
                    <ChevronDownIcon className="ml-2 mb-1 hidden h-5 w-5 dark:text-primary xsm:block" />
                </button>
            </div>
            <div className="flex max-[1400px]:w-full justify-between items-center p-[8px]  bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid border-[#58585a] rounded-[6px]">
                <div className="flex items-center">
                    <div className="flex flex-col pl-2">
                        <p className="text-[12px] leading-[14px] max-[480px]:text-[14px] max-[480px]:leading-[16px] font-[500] justify-center">Description</p>
                        <p className="text-[10px] leading-[12px] font-[500] max-[480px]:text-[12px] max-[1400px]:leading-[14px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                            sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud 
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit ....
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex max-[1400px]:w-full justify-between items-center p-[8px]  bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid border-[#58585a] rounded-[6px]">
                <div className="flex items-center">
                    {CloseCircle}
                    <div className="flex flex-col pl-2">
                        <p className="text-[12px] leading-[14px] max-[480px]:text-[14px] max-[480px]:leading-[16px] font-[500] justify-center">Stake Available</p>
                    </div>
                </div>
                <button>
                    <ExternalLink color="#3F3F46" />
                </button>
            </div>
            <div className="flex max-[1400px]:w-full justify-between items-center p-[8px]  bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid border-[#58585a] rounded-[6px]">
                <div className="flex items-center">
                    <DBSVG size="16"/>
                    <div className="flex flex-col pl-2">
                        <p className="text-[12px] leading-[14px] max-[480px]:text-[14px] max-[480px]:leading-[16px] font-[500] justify-center">Yield Farm Available</p>
                    </div>
                </div>
                <button>
                    <ExternalLink />
                </button>
            </div>
            <div className="flex max-[1400px]:w-full justify-between items-center p-[8px]  bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid border-[#58585a] rounded-[6px]">
                <div className="flex items-center">
                    <CheckCircleSVG size="16" color="#EEBB19"/>
                    <div className="flex flex-col pl-2">
                        <p className="text-[12px] leading-[14px] max-[480px]:text-[14px] max-[480px]:leading-[16px] font-[500] justify-center">Add liquidity to BREWALBS-BNB</p>
                    </div>
                </div>
                <button>
                    <ExternalLink />
                </button>
            </div>
        </div>
    )
}
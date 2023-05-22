import styled from "styled-components";
import { CircleSVG, CloseCircle, ExternalLink, DBSVG, CheckCircleSVG } from "@components/dashboard/assets/svgs";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Nav () {
    return (
        <div className="flex flex-col w-[224px] gap-[9px] max-[1400px]:w-full max-[1400px]:p-4 max-[1400px]:max-w-full">
            <Card className="h-[245px]">
            </Card>
            <Card>
                <div className="flex items-center">
                    <CircleSVG size="22"/>
                    <div className="flex flex-col pl-2">
                        <p className="font-[500] justify-center">273.82k BREWLABS Balance</p>
                        <p className="!text-[8px] !leading-[9px] font-[500] max-[480px]:!text-[10px] max-[1400px]:!leading-[14px]">50,802.22 USD</p>
                    </div>
                </div>
                <button>
                    <ChevronDownIcon className="ml-2 mb-1 hidden h-5 w-5 dark:text-primary xsm:block" />
                </button>
            </Card>
            <Card>
                <div className="flex items-center">
                    <div className="flex flex-col pl-2">
                        <p className="font-[500] justify-center">Description</p>
                        <p className="!text-[8px] !leading-[9px] font-[500] max-[480px]:!text-[10px] max-[1400px]:!leading-[14px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                            sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud 
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit ....
                        </p>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center">
                    {CloseCircle}
                    <div className="flex flex-col pl-2">
                        <p className="font-[500] justify-center">Stake Available</p>
                    </div>
                </div>
                <button>
                    <ExternalLink color="#3F3F46" />
                </button>
            </Card>
            <Card>
                <div className="flex items-center">
                    <DBSVG size="16"/>
                    <div className="flex flex-col pl-2">
                        <p className="font-[500] justify-center">Yield Farm Available</p>
                    </div>
                </div>
                <button>
                    <ExternalLink />
                </button>
            </Card>
            <Card>
                <div className="flex items-center">
                    <CheckCircleSVG size="16" color="#EEBB19"/>
                    <div className="flex flex-col pl-2">
                        <p className="font-[500] justify-center">Add liquidity to BREWALBS-BNB</p>
                    </div>
                </div>
                <button>
                    <ExternalLink />
                </button>
            </Card>
        </div>
    )
}

const Card = styled.div`
    border: 0.5px solid rgba(255, 255, 255, 0.25);
    background-color: rgba(185, 184, 184, 0.05);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;

    >div >div >p{
        font-size: 10px;
        line-height: 12px;
        font-weight: 500;

        @media screen and (max-width: 480px) {
            font-size: 14px;
            line-height: 16px;
        }
    }

    @media screen and (max-width: 1400px) {
        width: 100%;
    }
`;
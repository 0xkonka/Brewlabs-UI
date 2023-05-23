import { StarSVG, Inboxin, CircleSVG, CloseCircle } from "@components/dashboard/assets/svgs";
import styled from "styled-components";
export default function Favorite () {
    return (
        <div className="flex flex-col min-w-[224px] pl-[19px] pr-[15px] pt-[12px] pb-[12px] max-[1400px]:w-full max-[1400px]:p-4 max-[1400px]:max-w-full">
            <div className="flex items-center justify-between mb-[10px]">
                <div className="flex items-center justify-center gap-1">
                    <StarSVG />
                    <p className="!text-[#EEBB19] items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">Favorites</p>
                </div>
                <Button>
                    <p className="!text-[#2BA64E] items-center text-[10px] leading-[12px] font-[500] pr-[4px]">Open Wallet</p>
                    <button>{Inboxin}</button>
                </Button>
            </div>
            {[1, 2, 3, 4, 5, 6].map((id, index) => (
                <div className="flex items-center justify-between bg-[#1E1E21] rounded-[6px] mt-[5px] mb-[5px] pt-[13px] pb-[13px] pl-[19px] pr-[15px]" key={`favorite${index}`}>
                    <div className="flex items-center justify-center gap-1">
                        <CircleSVG />
                        <p className="!text-white items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">BREWLABS</p>
                        <p className="!text-[#909091] items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">WBNB</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 ml-[20px]">
                        <p className="!text-[#2BA64E] text-[8px] leading-[9px] font-[500] max-[480px]:text-[10px]">+2.23%</p>
                        <p className="text-white text-[12px] leading-[14px] font-[900] max-[480px]:text-[16px]">$1.002</p>
                        <div className="relative top-[-15px] right-[-20px] ml-[-15px]">
                            <button>{CloseCircle}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Button = styled.div`
    display: flex;
    align-items: center;
    width: 87px;
    background: #1E1E21;
    border-radius: 6px;
    justify-center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    @media screen and (max-width: 480px) {
        width: 107px;
    }

    p{
        font-size: 10px;
        line-height: 12px;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

        @media screen and (max-width: 480px) {
            font-size: 14px;
            line-height: 16px;
        }
    }
`;
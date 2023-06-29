import { StarSVG, Inboxin, CircleSVG, CloseCircle } from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";

export default function Favorite () {
    const {
        favorites,
        setFavoriteData
    }: any = useContext(ChartContext);

    return (
        <div className="flex flex-col min-w-[224px] pl-[19px] pr-[15px] pt-[12px] pb-[12px] max-[1400px]:w-full max-[1400px]:p-4 max-[1400px]:max-w-full">
            <div className="flex items-center justify-between mb-[10px]">
                <div className="flex items-center justify-center gap-1">
                    <StarSVG />
                    <p className="!text-[#EEBB19] items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">Favorites</p>
                </div>
                <div className="flex items-center w-[87px] bg-[#1E1E21] rounded-[6px] justify-center drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)] max-[480px]:w-[107px]">
                    <p className="text-[10px] leading-[12px] !text-[#2BA64E] items-center text-[10px] leading-[12px] font-[500] pr-[4px] drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)] max-[480px]:text-[14px] max-[480px]:leading-[16px]">Open Wallet</p>
                    <button>{Inboxin}</button>
                </div>
            </div>
            {favorites.map((favorite, index) => (
                <div className="flex items-center justify-between bg-[#1E1E21] rounded-[6px] mt-[5px] mb-[5px] pt-[13px] pb-[13px] pl-[19px] pr-[15px]" key={`favorite${index}`}>
                    <div className="flex items-center justify-center gap-1">
                        <CircleSVG />
                        <p className="!text-white items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">{favorite}</p>
                        {/* <p className="!text-[#909091] items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">WBNB</p> */}
                    </div>
                    <div className="flex items-center justify-center gap-1 ml-[20px]">
                        <p className="!text-[#2BA64E] text-[8px] leading-[9px] font-[500] max-[480px]:text-[10px]">+2.23%</p>
                        <p className="text-white text-[12px] leading-[14px] font-[900] max-[480px]:text-[16px]">$1.002</p>
                        <div className="relative top-[-15px] right-[-20px] ml-[-15px] cursor-pointer">
                            <button onClick={() => {setFavoriteData(favorite)}}>{CloseCircle}</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
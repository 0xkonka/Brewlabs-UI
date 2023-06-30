import { StarSVG, Inboxin, CircleSVG, CloseCircle } from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";

export default function Favorite() {
  const { favorites, setFavoriteData }: any = useContext(ChartContext);

  return (
    <div className="flex min-w-[224px] flex-col pb-[12px] pl-[19px] pr-[15px] pt-[12px] max-[1400px]:w-full max-[1400px]:max-w-full max-[1400px]:p-4">
      <div className="mb-[10px] flex items-center justify-between">
        <div className="flex items-center justify-center gap-1">
          <div className="text-primary">{StarSVG}</div>
          <p className="items-center text-[10px] font-[500] leading-[12px] !text-[#EEBB19] max-[480px]:text-[14px]">
            Favorites
          </p>
        </div>
        <div className="drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)] flex w-[87px] items-center justify-center rounded-[6px] bg-[#1E1E21] max-[480px]:w-[107px]">
          <p className="drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)] items-center pr-[4px] text-[10px] text-[10px] font-[500] leading-[12px] leading-[12px] !text-[#2BA64E] max-[480px]:text-[14px] max-[480px]:leading-[16px]">
            Open Wallet
          </p>
          <button>{Inboxin}</button>
        </div>
      </div>
      {favorites.map((favorite, index) => (
        <div
          className="mb-[5px] mt-[5px] flex items-center justify-between rounded-[6px] bg-[#1E1E21] pb-[13px] pl-[19px] pr-[15px] pt-[13px]"
          key={`favorite${index}`}
        >
          <div className="flex items-center justify-center gap-1">
            <CircleSVG />
            <p className="items-center text-[10px] font-[500] leading-[12px] !text-white max-[480px]:text-[14px]">
              {favorite}
            </p>
            {/* <p className="!text-[#909091] items-center text-[10px] leading-[12px] font-[500] max-[480px]:text-[14px]">WBNB</p> */}
          </div>
          <div className="ml-[20px] flex items-center justify-center gap-1">
            <p className="text-[8px] font-[500] leading-[9px] !text-[#2BA64E] max-[480px]:text-[10px]">+2.23%</p>
            <p className="text-[12px] font-[900] leading-[14px] text-white max-[480px]:text-[16px]">$1.002</p>
            <div className="relative right-[-20px] top-[-15px] ml-[-15px] cursor-pointer">
              <button
                onClick={() => {
                  setFavoriteData(favorite);
                }}
              >
                {CloseCircle}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

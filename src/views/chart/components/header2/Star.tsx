import {
  CircleSVG,
  StarSVG,
  LockSVG,
  CheckCircleSVG,
  ThumbUpSVG,
  ThumbDownSVG,
  WebSiteSVG,
  EmailSVG,
  TelegramSVG,
  TwitterSVG,
  DiscordSVG,
} from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import { useContext, useEffect } from "react";

export const Star = () => {
  const { tokenData, pairData, fetchFavoriteData, favorites, setFavoriteData }: any = useContext(ChartContext);

  useEffect(() => {
    fetchFavoriteData();
  }, []);
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 max-[700px]:flex-col max-[700px]:justify-center max-[480px]:gap-4">
      <div className="flex">
        <button
          className="flex items-center pr-[9px]"
          onClick={() => {
            tokenData && pairData && setFavoriteData(`${tokenData.data.symbol}-${pairData.data.tokenRef.symbol}`);
          }}
        >
          {tokenData &&
            pairData &&
            (favorites.includes(`${tokenData.data.symbol}-${pairData.data.tokenRef.symbol}`) ? (
              <StarSVG color="#eebb19" size="20px" />
            ) : (
              <StarSVG color="#3F3F46" size="20px" />
            ))}
        </button>
        <div className="flex pr-[7px]">
          <div className="border-1 flex items-center justify-center border-solid border-black">
            {tokenData ? (
              <img
                src={`https://www.dextools.io/resources/tokens/logos/${tokenData.data.logo}`}
                className="h-[22px] w-[22px] rounded-[30px]"
                alt={""}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex pr-[13px]">
          <div className="border-1 relative z-[2] flex items-center justify-center border-solid border-black">
            <CircleSVG size="22" />
          </div>
          <div className="border-1 relative left-[-20px] z-[0]  ml-2.5 flex items-center justify-center border-solid border-black">
            <CircleSVG size="22" />
          </div>
          <div className="relative bottom-[6px] right-[30px]">{LockSVG}</div>
        </div>
        <div className="ml-[-30px] flex pr-[14px]">
          <p className="z-[2] mt-2 font-brand text-[20px] font-bold leading-[23px] tracking-widest text-[600] text-white">
            {tokenData && tokenData.data.symbol}-{pairData && pairData.data.tokenRef.symbol}
          </p>
          <div className="relative right-[10px] top-[6px] z-[0]">
            <CheckCircleSVG />
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="ml-[-30px] flex items-center justify-center gap-[6px] pl-[10px]">
          <button
            className="border-1 flex items-center justify-center border-solid border-black"
            onClick={() => {
              if (tokenData) window.open(tokenData.data.links.website, "_blank");
            }}
          >
            <WebSiteSVG color={tokenData && (tokenData.data.links.website.length > 0 ? "#fff" : "#3f3f46")} />
          </button>
          <a
            className="border-1 flex items-center justify-center border-solid border-black"
            href={tokenData && `mailto:${tokenData.data.info.email}`}
          >
            <EmailSVG color={tokenData && (tokenData.data.info.email.length > 0 ? "#fff" : "#3f3f46")} />
          </a>
          <button
            className="border-1 flex items-center justify-center border-solid border-black"
            onClick={() => {
              if (tokenData) window.open(tokenData.data.links.telegram, "_blank");
            }}
          >
            <TelegramSVG color={tokenData && (tokenData.data.links.telegram.length > 0 ? "#fff" : "#3f3f46")} />
          </button>
          <button
            className="border-1 flex items-center justify-center border-solid border-black"
            onClick={() => {
              if (tokenData) window.open(tokenData.data.links.twitter, "_blank");
            }}
          >
            <TwitterSVG color={tokenData && (tokenData.data.links.twitter.length > 0 ? "#fff" : "#3f3f46")} />
          </button>
          <button
            className="border-1 flex cursor-pointer items-center justify-center border-solid border-black"
            onClick={() => {
              if (tokenData) window.open(tokenData.data.links.discord, "_blank");
            }}
          >
            <DiscordSVG color={tokenData && (tokenData.data.links.discord.length > 0 ? "#fff" : "#3f3f46")} />
          </button>
        </div>
        <div className="ml-1.5 flex justify-center gap-2 pl-[14px]">
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
  );
};

import { ChartSVG, FixedSVG, LiquiditySVG, VolumeSVG, downSVG, upSVG } from "@components/dashboard/assets/svgs";
import TokenLogo from "@components/logo/TokenLogo";
import { StarIcon } from "@heroicons/react/24/solid";
import { DEX_LOGOS } from "config/constants/swap";
import { isAddress } from "utils";
import { BigNumberFormat } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { useContext } from "react";
import { ChartContext } from "contexts/ChartContext";

export default function TokenInfo({ currency, marketInfos, showReverse }) {
  const { favourites, onFavourites }: any = useContext(ChartContext);

  const infos = [
    {
      icon: LiquiditySVG,
      value: `${BigNumberFormat(marketInfos.liquidity)} Pool liquidity`,
    },
    { icon: ChartSVG, value: `$${BigNumberFormat(marketInfos.marketCap, 0)} Marketcap` },
    {
      icon: FixedSVG,
      value: `${BigNumberFormat(
        marketInfos.holders ? marketInfos.holders : 0,
        (marketInfos.holders ? marketInfos.holders : 0) >= 1000 ? 2 : 0
      )} Holders`,
    },
    { icon: VolumeSVG, value: `${BigNumberFormat(marketInfos.volume24h)} Volume (24h)` },
  ];

  return (
    <div
      className={`relative z-0 mr-0 mt-5 flex flex-col items-start justify-between md:flex-row md:items-center ${
        showReverse ? "2xl:mr-[332px]" : "2xl:mr-[292px]"
      }`}
    >
      <div className="flex flex-col items-start xl:flex-row xl:items-center">
        <div className="item-start flex flex-col md:flex-row md:items-center ">
          <div className="flex items-center">
            <div className="cursor-pointer" onClick={() => onFavourites(currency, 1)}>
              <StarIcon
                className={`h-5 w-5 ${
                  favourites.find(
                    (favourite) =>
                      favourite.address === currency.address.toLowerCase() && favourite.chainId === currency.chainId
                  )
                    ? "text-primary"
                    : "text-tailwind"
                }`}
              />
            </div>
            <img src={DEX_LOGOS["uniswap"]} alt={""} className="primary-shadow mx-2 h-6 w-6 rounded-full" />
            <div className="flex">
              <TokenLogo
                src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
                classNames="primary-shadow z-10 -mr-4 h-6 w-6 rounded-full"
              />
              <TokenLogo
                src={getTokenLogoURL(isAddress(currency.tokenAddresses[1]), currency.chainId)}
                classNames="primary-shadow h-6 w-6 rounded-full"
              />
            </div>
            <div className="ml-2 text-white">
              {currency.symbols[0]}-{currency.symbols[1]}
            </div>
          </div>
          <div className="mt-2 flex items-center md:mt-0">
            {/* <div className="ml-5 flex items-center">
              <div className="flex items-center">
                <StyledButton
                  className="mr-2 !bg-transparent !text-[#2FD35DBF] disabled:!text-tailwind [&>svg]:!h-4 [&>svg]:!w-4"
                  onClick={() => voteOrAgainst(currency.address, account, currency.chainId, "voted")}
                  disabled={!activeNFT}
                >
                  {VoteSVG}
                </StyledButton>
                <div className="text-white">{pairInfo ? pairInfo.voted.length : 0}</div>
              </div>
              <div className="ml-3 flex items-center">
                <StyledButton
                  className="mr-2 mt-1 rotate-180 !bg-transparent !text-[#DC4545] disabled:!text-tailwind [&>svg]:!h-4 [&>svg]:!w-4"
                  onClick={() => voteOrAgainst(currency.address, account, currency.chainId, "devoted")}
                  disabled={!activeNFT}
                >
                  {VoteSVG}
                </StyledButton>
                <div className="text-white">{pairInfo ? pairInfo.devoted.length : 0}</div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap xl:mt-0 lg:ml-4 ml-0">
          {infos.map((data, i) => {
            return (
              <div key={i} className="mb-2 mr-0 flex w-[calc(50%-8px)] items-center md:mb-0 md:mr-4 md:w-fit">
                <div className="primary-shadow -mr-[3px] -mt-0.5 scale-[.8] text-tailwind">{data.icon}</div>
                <div className="ml-1.5 text-xs text-white">{data.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center">
        <div className={`flex items-center ${marketInfos.priceChange >= 0 ? "text-green" : "text-danger"}`}>
          <div className="mr-1 text-sm">
            {marketInfos.priceChange >= 0 ? "+" : ""}
            {(marketInfos.priceChange ?? 0).toFixed(2)}% (24h)
          </div>
          <div className="scale-[80%]">{marketInfos.priceChange >= 0 ? upSVG : downSVG}</div>
        </div>
        <div className="ml-2 text-lg text-white">${(marketInfos.price ?? 0).toFixed(3)}</div>
      </div>
    </div>
  );
}

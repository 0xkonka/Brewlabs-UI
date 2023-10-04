import { SkeletonComponent } from "@components/SkeletonComponent";
import { ChevronRightVG } from "@components/dashboard/assets/svgs";
import TokenLogo from "@components/logo/TokenLogo";
import Link from "next/link";
import { useTradingPair } from "state/pair/hooks";
import { SerializedTradingPair } from "state/types";
import { numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

export default function PairCard({ pair }) {
  const width = ["w-[140px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[120px]", "w-[30px]"];
  const { data }: { data: SerializedTradingPair } = useTradingPair(pair.chainId, pair.address);
  const isLoading = !Object.keys(data).length;

  return (
    <>
      <div className="mt-2 hidden h-[54px] cursor-pointer items-center justify-between rounded-md border border-transparent bg-[#29292C] px-4 font-brand text-white transition hover:border-brand md:flex">
        <div className={`${width[0]} `}>
          {isLoading ? (
            <SkeletonComponent />
          ) : (
            <div className="flex items-center">
              <TokenLogo src={getTokenLogoURL(data.token0.address, data.chainId)} alt={""} width={40} height={40} />

              <div className="ml-1.5">
                {data.token0.symbol}/{data.token1.symbol}
              </div>
            </div>
          )}
        </div>
        <div className={`${data.price24h >= 0 ? "text-green" : "text-danger"} ${width[1]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.price.toFixed(2))}`}
        </div>
        <div className={`${data.price24h >= 0 ? "text-green" : "text-danger"} ${width[2]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.price24h.toFixed(2))}`}
        </div>
        <div className={`${width[3]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.price24hHigh.toFixed(2))}`}
        </div>
        <div className={`${width[4]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.price24hLow.toFixed(2))}`}
        </div>
        <div className={`${width[5]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.voluem24h.toFixed(2))}`}
        </div>
        <div className={`${width[6]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.voluem24h.toFixed(2))}`}
        </div>
        <Link className={`${width[7]} `} href={"/constructor"}>
          {ChevronRightVG}
        </Link>
      </div>

      {/* <div className="mt-2.5 block w-full cursor-pointer rounded-md border border-transparent bg-[#29292C] p-4 text-sm hover:border-primary md:hidden">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <img
              src={getTokenLogoURL(data.token0.address, data.token0.chainId)}
              alt={""}
              className="mr-1.5 h-7 w-7 rounded-full"
            />
            <div className="text-lg text-white">
              {data.token0.symbol}/{data.token1.symbol}
            </div>
          </div>
          <img src={getChainLogo(data.chainId)} alt={""} className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex flex-wrap justify-between">
          <div className={`${data.change >= 0 ? "text-green" : "text-danger"} mr-4 mt-2`}>
            Last Price: ${numberWithCommas(data.lastPrice.toFixed(2))}
          </div>
          <div className={`${data.change >= 0 ? "text-green" : "text-danger"} mt-2`}>
            24H Change: {data.change.toFixed(1)}%
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="mr-4 mt-2">24H High: ${numberWithCommas(data.high.toFixed(2))}</div>
          <div className="mt-2">24H Low: ${numberWithCommas(data.low.toFixed(2))}</div>
        </div>
        <div className="mt-2">24H Volume: {numberWithCommas(data.volume.toFixed(2))}</div>
      </div> */}
    </>
  );
}

import { SkeletonComponent } from "@components/SkeletonComponent";
import { ChevronRightVG } from "@components/dashboard/assets/svgs";
import TokenLogo from "@components/logo/TokenLogo";
import Link from "next/link";
import { useTradingPair } from "state/pair/hooks";
import { SerializedTradingPair } from "state/types";
import { numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

export default function PairCard({ pair, setSelectedPair }) {
  const width = ["w-[160px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[120px]", "w-[30px]"];
  const { data }: { data: SerializedTradingPair } = useTradingPair(pair.chainId, pair.address);

  const isLoading = !data.baseToken;

  return (
    <>
      <div
        className="mt-2 hidden h-[54px] cursor-pointer items-center justify-between rounded-md border border-transparent bg-[#29292C] px-4 font-brand text-white transition hover:border-brand lg:flex"
        onClick={() => !isLoading && setSelectedPair(pair)}
      >
        <div className={`${width[0]} `}>
          {isLoading ? (
            <SkeletonComponent />
          ) : (
            <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
              <TokenLogo src={getTokenLogoURL(data.baseToken.address, data.chainId)} alt={""} classNames="h-7 w-7" />

              <div className="ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {data.baseToken.symbol}/{data.quoteToken.symbol}
              </div>
            </div>
          )}
        </div>
        <div className={`${data?.baseToken?.price24hChange >= 0 ? "text-green" : "text-danger"} ${width[1]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price.toFixed(2))}`}
        </div>
        <div className={`${data?.baseToken?.price24hChange >= 0 ? "text-green" : "text-danger"} ${width[2]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price24h.toFixed(2))}`}
        </div>
        <div className={`${width[3]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price24hHigh.toFixed(2))}`}
        </div>
        <div className={`${width[4]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price24hLow.toFixed(2))}`}
        </div>
        <div className={`${width[5]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.volume24h.toFixed(2))}`}
        </div>
        <div className={`${width[6]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.volume24h.toFixed(2))}`}
        </div>
        <Link className={`${width[7]} `} href={"/constructor"}>
          {ChevronRightVG}
        </Link>
      </div>

      <div
        className="mt-2.5 block w-full cursor-pointer rounded-md border border-transparent bg-[#29292C] p-4 text-sm text-white hover:border-primary lg:hidden"
        onClick={() => !isLoading && setSelectedPair(pair)}
      >
        {isLoading ? (
          <SkeletonComponent />
        ) : (
          <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
            <TokenLogo src={getTokenLogoURL(data.baseToken.address, data.chainId)} alt={""} classNames="h-7 w-7" />

            <div className="ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {data.baseToken.symbol}/{data.quoteToken.symbol}
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-between">
          <div className={`${data?.baseToken?.price24hChange >= 0 ? "text-green" : "text-danger"} mr-4 mt-2`}>
            Last Price: {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.baseToken.price.toFixed(2))}`}
          </div>
          <div className={`${data?.baseToken?.price24hChange >= 0 ? "text-green" : "text-danger"} mt-2`}>
            24H Change: {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price24h.toFixed(2))}%`}
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="mr-4 mt-2">
            24H High:{" "}
            {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.baseToken.price24hHigh.toFixed(2))}`}
          </div>
          <div className="mt-2">
            24H Low: {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.baseToken.price24hLow.toFixed(2))}`}
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="mr-4 mt-2">
            24H Volume: {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.volume24h.toFixed(2))}`}
          </div>
          <div className="mt-2">
            24H Volume (USD): {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.volume24h.toFixed(2))}`}
          </div>
        </div>
      </div>
    </>
  );
}

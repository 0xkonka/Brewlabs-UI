import { Currency } from "@brewlabs/sdk";
import { SkeletonComponent } from "@components/SkeletonComponent";
import { ChevronRightVG } from "@components/dashboard/assets/svgs";
import TokenLogo from "@components/logo/TokenLogo";
import { DEXTOOLS_CHAINNAME } from "config";
import Link from "next/link";
import { useTradingPair } from "state/pair/hooks";
import { SerializedTradingPair } from "state/types";
import { getAddLiquidityUrl, numberWithCommas } from "utils/functions";

export default function PairCard({ pair, setSelectedPair }) {
  const width = ["w-[160px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[80px]", "w-[120px]"];
  const { data }: { data: SerializedTradingPair } = useTradingPair(pair.chainId, pair.address);

  const isLoading = !data.baseToken;

  
  return (
    <>
      <Link
        className="mt-2 hidden h-[54px] cursor-pointer items-center justify-between rounded-md border border-transparent bg-[#29292C] px-4 font-brand text-white transition duration-300 hover:scale-[1.03] hover:border-brand lg:flex"
        onClick={() => !isLoading && setSelectedPair(pair)}
        href={getAddLiquidityUrl("brewlabs", data.quoteToken as Currency, data.baseToken as Currency, data.chainId)}
      >
        <div className={`${width[0]} `}>
          {isLoading ? (
            <SkeletonComponent />
          ) : (
            <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
              <TokenLogo
                src={`https://assets-stage.dex.guru/icons/${data.baseToken.address}-${
                  DEXTOOLS_CHAINNAME[data.chainId]
                }.png`}
                alt={""}
                classNames="h-7 w-7"
              />

              <TokenLogo
                src={`https://assets-stage.dex.guru/icons/${data.quoteToken.address}-${
                  DEXTOOLS_CHAINNAME[data.chainId]
                }.png`}
                alt={""}
                classNames="h-7 w-7 -ml-3 z-10"
              />

              <div className="ml-2 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {data.baseToken.symbol}/{data.quoteToken.symbol}
              </div>
            </div>
          )}
        </div>
        <div className={`${data?.baseToken?.price24hChange >= 0 ? "text-green" : "text-danger"} ${width[1]} `}>
          {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.baseToken.price.toFixed(2))}`}
        </div>
        <div className={`${data?.baseToken?.price24hChange >= 0 ? "text-green" : "text-danger"} ${width[2]} `}>
          {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price24hChange.toFixed(2))}`}
        </div>
        <div className={`${width[3]} `}>
          {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.volume24h.toFixed(2))}`}
        </div>
        <div className={`${width[4]} `}>
          {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.tvl.toFixed(2))}`}
        </div>
        <div className={`${width[5]} `}>
          {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.feesCollected24h.toFixed(2))}`}
        </div>
      </Link>

      <div
        className="mt-2.5 block w-full cursor-pointer rounded-md border border-transparent bg-[#29292C] p-4 text-sm text-white hover:border-primary lg:hidden"
        onClick={() => !isLoading && setSelectedPair(pair)}
      >
        {isLoading ? (
          <SkeletonComponent />
        ) : (
          <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
            <TokenLogo
              src={`https://assets-stage.dex.guru/icons/${data.baseToken.address}-${
                DEXTOOLS_CHAINNAME[data.chainId]
              }.png`}
              alt={""}
              classNames="h-7 w-7 z-10 relative"
            />

            <TokenLogo
              src={`https://assets-stage.dex.guru/icons/${data.quoteToken.address}-${
                DEXTOOLS_CHAINNAME[data.chainId]
              }.png`}
              alt={""}
              classNames="h-7 w-7 -ml-3"
            />
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
            24H Change:{" "}
            {isLoading ? <SkeletonComponent /> : `${numberWithCommas(data.baseToken.price24hChange.toFixed(2))}%`}
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="mr-4 mt-2">
            24H Volume (USD): {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.volume24h.toFixed(2))}`}
          </div>
          <div className="mt-2">
            TVL: {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.tvl.toFixed(2))}`}
          </div>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="mr-4 mt-2">
            Fees Collected:{" "}
            {isLoading ? <SkeletonComponent /> : `$${numberWithCommas(data.feesCollected24h.toFixed(2))}`}
          </div>
        </div>
      </div>
    </>
  );
}

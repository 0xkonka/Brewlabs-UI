import { SkeletonComponent } from "@components/SkeletonComponent";
import {
  BarChartSVG,
  CommunitySVG,
  DeployerSVG,
  DetailSVG,
  FixedSVG,
  InfoSVG,
  LockSVG,
  NFTFillSVG,
  UpDownSVG,
  chevronLeftSVG,
} from "@components/dashboard/assets/svgs";
import { useOETHMonthlyAPY } from "@hooks/useOETHAPY";
import useTokenMarketChart from "@hooks/useTokenMarketChart";
import useTokenBalances from "@hooks/useTokenMultiChainBalance";
import clsx from "clsx";
import { NFT_RARE_COUNT } from "config/constants/nft";
import { tokens } from "config/constants/tokens";
import { CommunityContext } from "contexts/CommunityContext";
import React, { ReactNode, useContext } from "react";
import Carousel from "react-multi-carousel";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useIndexes } from "state/indexes/hooks";
import { numberWithCommas } from "utils/functions";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1080 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 1080, min: 700 },
    items: 2,
  },
  small: {
    breakpoint: { max: 700, min: 0 },
    items: 1,
  },
};

const InfoCarousel = () => {
  const { treasuryValue, tvl, buybackValue, transactionCount, communities, feeCollectedValue }: any =
    useContext(CommunityContext);
  const { indexes } = useIndexes();

  const OETHMontlyAPY = useOETHMonthlyAPY();
  const { balances: NFT_wallet_balance } = useTokenBalances(
    { 1: [tokens[1].oeth, tokens[1].oeth] },
    {
      1: ["0x5b4b372Ef4654E98576301706248a14a57Ed0164", "0xEDDcEa807da853Fed51fa4bF0E8d6C9d1f7f9Caa"],
    }
  );

  const tokenMarketData = useTokenMarketChart(1);

  const OETHPrice = tokenMarketData[tokens[1].oeth.address.toLowerCase()]
    ? tokenMarketData[tokens[1].oeth.address.toLowerCase()].usd
    : null;

  const NFT_MontlyApr =
    NFT_wallet_balance && OETHMontlyAPY && OETHPrice
      ? ((OETHMontlyAPY * NFT_wallet_balance[1][1].balance * OETHPrice) / NFT_RARE_COUNT[56] / 9) * 12
      : null;

  const items = [
    {
      name: "Treasury Value",
      suffix: "USD",
      icon: BarChartSVG,
      value:
        treasuryValue === null ? (
          <SkeletonComponent className="!min-w-[120px]" />
        ) : (
          `$${numberWithCommas(treasuryValue.toFixed(2))}`
        ),
      tooltip: "Total treasury value across all chains.",
    },
    {
      name: "TVL",
      suffix: "USD",
      icon: LockSVG,
      value: tvl === null ? <SkeletonComponent className="!min-w-[120px]" /> : `$${numberWithCommas(tvl.toFixed(2))}`,
      tooltip: "TotaTVL or Total Value Locked across all chains.",
    },
    {
      name: "BREWLABS Buy Back",
      suffix: "USD",
      icon: DeployerSVG,
      value:
        buybackValue === null ? (
          <SkeletonComponent className="!min-w-[120px]" />
        ) : (
          `$${numberWithCommas(buybackValue.toFixed(2))}`
        ),
      tooltip: "Total USD value of Brewlabs buy backs from fees since March 2022.",
    },
    {
      name: "Fee’s collected",
      suffix: "USD",
      icon: UpDownSVG,
      value:
        feeCollectedValue === null ? (
          <SkeletonComponent className="!min-w-[120px]" />
        ) : (
          `$${numberWithCommas(feeCollectedValue.toFixed(2))}`
        ),
      tooltip: "Total fees collected.",
    },
    {
      name: "Transactions",
      suffix: "Tx",
      icon: FixedSVG,
      value:
        transactionCount === null ? (
          <SkeletonComponent className="!min-w-[120px]" />
        ) : (
          `${numberWithCommas(transactionCount)}`
        ),
      tooltip: "Total transactions made across Brewlabs dAPP.",
    },
    {
      name: "Communities",
      suffix: "",
      icon: CommunitySVG,
      value: numberWithCommas(communities.length),
      tooltip: "Total communities added.",
    },
    {
      name: "User Indexes",
      suffix: "",
      icon: DetailSVG,
      value: numberWithCommas(indexes.length),
      tooltip: "Total user indexes active.",
    },
    {
      name: "Brewlabs NFT Staking",
      suffix: "APR",
      icon: NFTFillSVG,
      value: NFT_MontlyApr === null ? <SkeletonComponent className="!min-w-[120px]" /> : `${NFT_MontlyApr.toFixed(2)}%`,
      tooltip: "Best performing NFT staking pool.",
    },
  ];
  const CustomRightArrow = ({ onClick }) => {
    return (
      <div onClick={() => onClick()} className="absolute  -right-5 -scale-125 cursor-pointer text-[#7a7a7c]">
        {chevronLeftSVG}
      </div>
    );
  };

  const CustomLeftArrow = ({ onClick }) => {
    return (
      <div onClick={() => onClick()} className="absolute -left-5 scale-125 cursor-pointer text-[#7a7a7c]">
        {chevronLeftSVG}
      </div>
    );
  };
  return (
    <div className="relative mx-3 mb-20">
      <Carousel
        responsive={responsive}
        infinite={true}
        draggable={false}
        autoPlay={false}
        autoPlaySpeed={100000000}
        arrows={true}
        customRightArrow={<CustomRightArrow onClick={undefined} />}
        customLeftArrow={<CustomLeftArrow onClick={undefined} />}
        className="!static"
        itemClass="flex justify-center"
      >
        {items.map((data, i) => {
          return (
            <div key={i} className="p-2">
              <div className="primary-shadow h-[100px] w-[260px] rounded-[12px] bg-[linear-gradient(180deg,#35353B_1.04%,rgba(35,35,38,0.00)_100%)] p-5 xsm:w-[300px]">
                <div className="flex items-center justify-between">
                  <div className="text-primary">{data.name}</div>
                  <div className="text-tailwind [&>svg]:!h-4 [&>svg]:!w-4">{data.icon}</div>
                </div>
                <div className="flex items-center justify-between text-3xl text-white">
                  <div className="flex items-end">
                    {data.value}&nbsp;<span className="text-base text-[#FFFFFF80]">{data.suffix}</span>
                  </div>
                  <div
                    className="mt-1 cursor-pointer text-tailwind transition hover:text-[#FFFFFF80] [&>svg]:!h-4 [&>svg]:!w-4 [&>svg]:!opacity-100 "
                    id={data.tooltip}
                  >
                    {InfoSVG}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
      {items.map((data, i) => (
        <ReactTooltip anchorId={data.tooltip} place="top" content={data.tooltip} key={i} />
      ))}
    </div>
  );
};

export default InfoCarousel;

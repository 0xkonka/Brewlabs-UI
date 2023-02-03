import { useState } from "react";
import styled from "styled-components";
import { makeSkeletonComponent, numberWithCommas } from "utils/functions";

const PoolCard = ({
  data,
  index,
  setSelectPoolDetail,
  setCurPool,
}: {
  data: any;
  index: number;
  setSelectPoolDetail: any;
  setCurPool: any;
}) => {
  const poolNames = { 1: "Staking Pool", 2: "Yield Farms", 3: "Indexes", 4: "Zapper Pools" };
  return (
    <StyledContainer
      index={index}
      onClick={() => {
        setSelectPoolDetail(true);
        setCurPool(index);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-[80px] pl-4">
          <img src={data.chainLogo} alt={""} className="w-9" />
        </div>
        <div className="flex min-w-[210px] items-center">
          <img src={data.earningToken.logo} alt={""} className="mr-3 w-7 rounded-full" />
          <div>
            <div className="leading-none">
              <span className="text-primary">Earn</span> {data.earningToken.symbol}
            </div>
            <div className="text-xs">
              {poolNames[data.type]} - {data.duration === 0 ? "Flexible" : `${data.duration} day lock`}
            </div>
          </div>
        </div>
        <div className="min-w-[70px]">
          {data.tvl !== undefined ? `$${numberWithCommas(data.tvl)}` : makeSkeletonComponent()}
        </div>
        <div className="min-w-[160px]">
          {data.stakedAddresses !== undefined ? data.stakedAddresses : makeSkeletonComponent()}
        </div>
        <div className="min-w-[250px]">
          {data.totalStaked !== undefined
            ? `${numberWithCommas(data.totalStaked)} ${data.stakingToken.symbol}`
            : makeSkeletonComponent()}
        </div>
        <div className="min-w-[80px]">
          {data.type !== 3 ? (
            data.apr !== undefined ? (
              `${data.apr}%`
            ) : (
              <div className="mr-2">{makeSkeletonComponent()}</div>
            )
          ) : (
            "N/A"
          )}
        </div>
      </div>
      <div className="flex hidden flex-col px-6">
        <div className="flex  items-center justify-between ">
          <div className="flex items-center">
            <img src={data.earningToken.logo} alt={""} className="mr-3 w-7 rounded-full" />
            <div>
              <div className="leading-none">
                <span className="text-primary">Earn</span> {data.earningToken.symbol}
              </div>
              <div className="text-xs">
                {poolNames[data.type]} - {data.duration === 0 ? "Flexible" : `${data.duration} day lock`}
              </div>
            </div>
          </div>
          <img src={data.chainLogo} alt={""} className="w-9" />
        </div>
        <div className="mt-6 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="flex text-2xl">
            APR:&nbsp;
            {data.type !== 3 ? (
              data.apr !== undefined ? (
                `${data.apr}%`
              ) : (
                <div className="mr-2">{makeSkeletonComponent()}</div>
              )
            ) : (
              "N/A"
            )}
          </div>
          <div>
            <div className="text-left xsm:text-right">Total supply staked</div>
            <div className="text-left text-sm xsm:text-right">
              {data.totalStaked !== undefined
                ? `${numberWithCommas(data.totalStaked)} ${data.stakingToken.symbol}`
                : makeSkeletonComponent()}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="flex">
            TVL:&nbsp;{data.tvl !== undefined ? `$${numberWithCommas(data.tvl)}` : makeSkeletonComponent()}
          </div>
          <div className="flex">
            Staked Address:&nbsp;{data.stakedAddresses !== undefined ? data.stakedAddresses : makeSkeletonComponent()}
          </div>
        </div>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ index: number }>`
  background: ${({ index }) => (index % 2 ? "#D9D9D91A" : "#D9D9D90D")};
  border-radius: 4px;
  color: #ffffffbf;
  font-size: 18px;
  padding: 15px 0;
  margin-bottom: 10px;
  transition: 0.3s all;
  border: 1px solid transparent;
  :hover {
    border-color: #ffde0d;
  }
  cursor: pointer;
  @media screen and (max-width: 1280px) {
    > div:nth-child(1) > div:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 1024px) {
    > div:nth-child(1) > div:nth-child(4) {
      display: unset;
    }
  }
  @media screen and (max-width: 1080px) {
    padding: 24px 0;
    > div:nth-child(1) {
      display: none;
    }
    > div:nth-child(2) {
      display: flex !important;
    }
  }
`;

export default PoolCard;

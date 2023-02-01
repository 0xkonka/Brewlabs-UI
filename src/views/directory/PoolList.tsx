import { useRef, useState } from "react";
import styled from "styled-components";
import PoolCard from "./PoolCard";

const PoolList = ({ pools, setSelectPoolDetail }: { pools: any; setSelectPoolDetail: any }) => {
  return (
    <StyledContainer>
      <PoolHeader>
        <div className="min-w-[80px]">Network</div>
        <div className="min-w-[210px] pl-10">Pool</div>
        <div className="min-w-[70px]">TVL</div>
        <div className="min-w-[160px]">Staked addresses</div>
        <div className="min-w-[250px]">Total supply staked</div>
        <div className="min-w-[70px]">APR</div>
      </PoolHeader>
      <div className="h-[1px] w-full bg-[#FFFFFF80]" />
      <PoolPanel>
        {pools.map((data: any, i: number) => {
          return <PoolCard data={data} key={i} index={i} setSelectPoolDetail={setSelectPoolDetail} />;
        })}
      </PoolPanel>
    </StyledContainer>
  );
};

const PoolHeader = styled.div`
  margin-right: 16px;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 18px;
  color: #ffffff80;
  @media screen and (max-width: 1280px) {
    > div:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 1024px) {
    > div:nth-child(4) {
      display: unset;
    }
  }
  @media screen and (max-width: 1080px) {
    display: none;
  }
`;

const PoolPanel = styled.div`
  overflow-y: scroll;
  display: flex;
  height: 500px;
  flex-direction: column;
  padding: 8px 0;
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    display: block !important;
  }

  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb:vertical {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #eebb19;
  }
  @media screen and (max-width: 1080px) {
    height: fit-content;
    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const StyledContainer = styled.div`
  background: rgba(185, 184, 184, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  padding: 0 20px;
  @media screen and (max-width: 1080px) {
    > div:nth-child(2) {
      display: none;
    }
    border: none;
    background: none;
    padding: 0;
  }
`;

export default PoolList;

import { ChevronDownSVG, InfoSVG, downSVG } from "components/dashboard/assets/svgs";
import { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import styled from "styled-components";
import StyledButton from "views/directory/StyledButton";
import OutlinedButton from "../button/OutlinedButton";

const SwapRewards = () => {
  const filters = [`All (63)`, `Holder (5)`, `Liquidity provider (4)`, `Token owner (4)`];

  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");

  return (
    <StyledContainer className="font-roboto">
      <ReactTooltip
        anchorId={"brewSwapInfo"}
        place="right"
        content="Pairs on BrewSwap distribute trading volume fees to liquidity providers, owners and token holders instantly"
      />
      <div className="flex flex-col items-center justify-between xsm:flex-row">
        <div className="relative text-2xl text-white">
          <span className="ml-2 text-[#FCD34D]">Brew</span>Swap Rewards
          <div className="absolute top-2.5 -left-3 scale-150 text-white" id={"brewSwapInfo"}>
            {InfoSVG}
          </div>
        </div>
        <div className="relative h-[36px] w-[134px] xsm:mt-0 mt-4">
          <StyledButton type={"quinary"}>
            <div className="text-xs leading-none">
              Harvest <span className="text-[#EEBB19]">All</span>
            </div>
            <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronDownSVG}</div>
          </StyledButton>
          <div className="absolute -bottom-5 left-2 flex items-center">
            <div className="mr-2 scale-125 text-white">{InfoSVG}</div>
            <div className="text-xs text-[#FFFFFF80]">$4.42 USD</div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap">
        {filters.map((data, i) => {
          return (
            <FilterButton key={i} active={curFilter === i} onClick={() => setCurFilter(i)} className="mt-2">
              {data}
            </FilterButton>
          );
        })}
      </div>
      <div className="mt-2  w-full max-w-[280px]">
        <SearchInput placeholder="Search token..." value={criteria} onChange={(e) => setCriteria(e.target.value)} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between rounded-[30px] border  border-[#FFFFFF80] p-[24px_12px_24px_12px] sm:p-[24px_15px_24px_24px]">
        <div className="h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
        <div className="mx-2 flex items-center">
          <div className="h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
          <div className="-ml-3 h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
          <div className="ml-2">
            <div className="text-white">ETH-BREWLABS</div>
            <div className="text-xs text-[#FFFFFF80]">Vol. $2,000.82 </div>
          </div>
        </div>
        <div className="relative mt-5 h-[36px] w-full xsm:mt-0 xsm:w-[110px]">
          <StyledButton type={"quinary"}>
            <div className="text-xs leading-none">Harvest</div>
            <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronDownSVG}</div>
          </StyledButton>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between rounded-[30px] border border-[#FFFFFF80] p-[24px_12px_24px_12px] sm:p-[24px_15px_24px_24px]">
        <div className="h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
        <div className="mx-2 flex items-center">
          <div className="h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
          <div className="-ml-3 h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
          <div className="ml-2">
            <div className="text-white">ETH-BREWLABS</div>
            <div className="text-xs text-[#FFFFFF80]">Vol. $0,00 </div>
          </div>
        </div>
        <div className="relative mt-5 h-[36px] w-full xsm:mt-0 xsm:w-[110px]">
          <StyledButton type={"quinary"}>
            <div className="text-xs leading-none">Harvest</div>
            <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronDownSVG}</div>
          </StyledButton>
        </div>
      </div>
      <div className="mt-8">
        <OutlinedButton href="https://brewlabs.info/" className="mt-2" small>
          Back
        </OutlinedButton>
      </div>
    </StyledContainer>
  );
};

const SearchInput = styled.input`
  padding: 7px 10px;
  background: rgba(217, 217, 217, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 4px;
  color: white;
  font-size: 14px;
  width: 100%;
  outline: none;
  line-height: 100%;
  height: fit-content;
`;

const FilterButton = styled.div<{ active: boolean }>`
  cursor: pointer;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  color: #ffffff59;
  transition: all 0.15s;
  background: ${({ active }) => (active ? "#FFFFFF40" : "#d9d9d91a")};
  :hover {
    color: ${({ active }) => (active ? "#FFDE0D" : "white")};
  }
  margin-right: 10px;
  line-height: 100%;
  height: fit-content;
  color: ${({ active }) => (active ? "#FFDE0D" : "#FFFFFF59")};
  white-space: nowrap;
`;

const StyledContainer = styled.div`
  .react-tooltip {
    width: 300px;
    z-index: 100;
  }
`;

export default SwapRewards;

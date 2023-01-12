/* eslint-disable react-hooks/exhaustive-deps */
import DropDown from "./Dropdown";
import { useState } from "react";
import styled from "styled-components";

const ToolBar = ({
  showType,
  filterType,
  setFilterType,
  fullOpen,
  listType,
  setListType,
}: {
  setFilterType?: any;
  filterType: number;
  showType?: number;
  fullOpen: boolean;
  listType: number;
  setListType: any;
}) => {
  return (
    <div className={"flex items-center justify-between"}>
      <div className={"w-[100px] xmd:w-[160px]"}>
        <DropDown value={listType} setValue={setListType} />
      </div>
      <StyledOption
        className={`${fullOpen ? "min-w-[8px]" : "min-w-[45px]"} font-semibold`}
        onClick={() => setFilterType(1)}
        active={filterType === 1}
      >
        {fullOpen ? (
          ""
        ) : (
          <>
            <div className="mr-px ml-2 text-xxs text-white">Balance</div>
            <img src={"/images/dashboard/updown.svg"} alt={""} />
          </>
        )}
      </StyledOption>
      <StyledOption className={`min-w-[28px] font-semibold`} onClick={() => setFilterType(2)} active={filterType === 2}>
        <div className="mr-px text-xxs text-white">Price</div>
        <img src={"/images/dashboard/updown.svg"} alt={""} />
      </StyledOption>
      <StyledOption className={`min-w-[40px] font-semibold`} onClick={() => setFilterType(3)} active={filterType === 3}>
        <div className="mr-px text-xxs text-white">Value</div>
        <img src={"/images/dashboard/updown.svg"} alt={""} />
      </StyledOption>
      <StyledOption className={`min-w-[60px] font-semibold`} onClick={() => setFilterType(4)} active={filterType === 4}>
        <div className="mr-px text-xxs text-white">Total Rewards</div>
        <img src={"/images/dashboard/updown.svg"} alt={""} />
      </StyledOption>
      <StyledOption className={`min-w-[72px] font-semibold`} onClick={() => setFilterType(5)} active={filterType === 5}>
        <div className="mr-px text-xxs text-white">Pending Rewards</div>
        <img src={"/images/dashboard/updown.svg"} alt={""} />
      </StyledOption>
      <div className={"w-[40px]"} />
    </div>
  );
};

const StyledOption = styled.div<{ active: boolean }>`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  > img {
    transform: ${({ active }) => (active ? "scaleY(-1)" : "")};
  }
`;
export default ToolBar;

import { useState } from "react";
import styled from "styled-components";
import DropDown from "./Dropdown";
import ActivityDropdown from "./ActivityDropdown";

const SelectionPanel = ({
  pools,
  curFilter,
  setCurFilter,
  criteria,
  setCriteria,
}: {
  pools: any;
  curFilter: number;
  setCurFilter: any;
  criteria: string;
  setCriteria: any;
}) => {
  let counts = [];
  for (let i = 1; i <= 4; i++) {
    const filter = pools.filter((data: any) => data.type === i);
    counts[i] = filter.length;
  }
  const filters = [
    `All (${counts[1] + counts[2] + counts[3] + counts[4]})`,
    `Staking Pools (${counts[1]})`,
    `Yield Farms (${counts[2]})`,
    `Indexes (${counts[3]})`,
    `Zapper Pools (${counts[4]})`,
    `My positions (0)`,
  ];

  const [activity, setActivity] = useState("active");

  return (
    <div className="flex flex-row items-end md:flex-col md:items-start">
      <div className="mb-0 block flex flex-1 items-center justify-between md:mb-3 xl:hidden w-full">
        <div className="max-w-[500px] flex-1">
          <SearchInput placeholder="Search token..." value={criteria} onChange={(e) => setCriteria(e.target.value)} />
        </div>
        <div className="ml-4 hidden w-[110px] md:block">
          <ActivityDropdown value={activity} setValue={setActivity} />
        </div>
      </div>
      <div className="flex flex-none items-center justify-between md:flex-1 xl:w-full w-fit">
        <div className="hidden flex-1 md:flex">
          {filters.map((data, i) => {
            return (
              <FilterButton key={i} active={curFilter === i} onClick={() => setCurFilter(i)}>
                {data}
              </FilterButton>
            );
          })}
          <div className="hidden max-w-[280px] flex-1 xl:block">
            <SearchInput placeholder="Search token..." value={criteria} onChange={(e) => setCriteria(e.target.value)} />
          </div>
        </div>
        <div className="ml-4 hidden w-[110px] xl:block">
          <ActivityDropdown value={activity} setValue={setActivity} />
        </div>
      </div>
      <div className="xsm:ml-10 ml-4 block w-[160px]  md:hidden">
        <DropDown value={curFilter} setValue={setCurFilter} data={filters} />
        <div className="mt-2 w-full">
          <ActivityDropdown value={activity} setValue={setActivity} />
        </div>
      </div>
    </div>
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
export default SelectionPanel;

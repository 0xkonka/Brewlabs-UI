import StyledInput from "@components/StyledInput";
import { useState } from "react";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import StyledButton from "views/directory/StyledButton";

export default function HistoryToolBar({ showType, setShowType, criteria, setCriteria }: any) {
  const filters = ["Swaps (all)", "Swaps (buys)", "Swaps (sells)", "My swaps"];
  return (
    <div className="mt-2 flex flex-col items-start justify-between md:flex-row md:items-center ">
      <div className="flex w-full flex-col items-center xs:flex-row-reverse md:xs:flex-row">
        <div className="hidden md:flex">
          {filters.map((filter, i) => (
            <StyledButton
              type={"secondary"}
              className="mr-1.5 !h-8 !w-fit !border-transparent px-3 text-white"
              onClick={() => setShowType(i)}
              key={i}
            >
              <div className="flex items-center">
                <div
                  className={`mr-2 h-2 w-2 rounded-full bg-[#32FFB5] ${
                    showType === i ? "" : "hidden"
                  } shadow-[0px_0px_2px_#32FFB5]`}
                />
                <div className={showType === i ? "text-white" : "text-[#FFFFFF80]"}>{filter}</div>
              </div>
            </StyledButton>
          ))}
        </div>
        <div className="my-2 ml-0 block !w-full xs:my-0 xs:ml-2 xs:!w-[120px] md:hidden">
          <DropDown value={showType} setValue={setShowType} data={filters} />
        </div>
        <StyledInput
          value={criteria}
          setValue={setCriteria}
          placeholder="Search an address..."
          className="!h-8 w-full flex-none font-brand xs:w-fit xs:flex-1"
        />
      </div>
    </div>
  );
}

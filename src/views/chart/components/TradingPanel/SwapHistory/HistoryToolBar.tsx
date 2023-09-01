import StyledInput from "@components/StyledInput";
import { SearchCircleSVG } from "@components/dashboard/assets/svgs";
import { useState } from "react";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import StyledButton from "views/directory/StyledButton";

export default function HistoryToolBar({ showType, setShowType, criteria, setCriteria }: any) {
  const filters1 = ["Swaps", "Buys", "Sells"];
  const filters2 = ["My swaps", "My buys", "My sells"];
  const [address, setAddress] = useState("");
  return (
    <div className="mt-2 flex flex-col items-start justify-between md:flex-row md:items-center ">
      <div className="flex ">
        <div className="mr-1.5">
          <DropDown
            value={showType >= 3 ? 0 : showType}
            setValue={setShowType}
            data={filters1.map((filter: any, i: number) => (
              <div className="flex items-center" key={i}>
                <div
                  className={`mr-2 h-2 w-2 rounded-full bg-[#32FFB5] ${
                    showType === i ? "" : "hidden"
                  } shadow-[0px_0px_2px_#32FFB5]`}
                />
                <div className={showType === i ? "text-white" : "text-[#FFFFFF80]"}>{filter}</div>
              </div>
            ))}
            height={"32px"}
            rounded={"4px"}
            className="!w-[92px] !bg-[#29292B] !font-brand !text-sm !text-white"
            bodyClassName="!bg-none !bg-[#29292B]"
            itemClassName={`hover:!bg-[#48484b] !justify-start !px-2`}
          />
        </div>
        <div className="mr-1.5">
          <DropDown
            value={showType < 3 || showType > 5 ? 0 : showType - 3}
            setValue={(i) => setShowType(i + 3)}
            data={filters2.map((filter: any, i: number) => (
              <div className="flex items-center" key={i}>
                <div
                  className={`mr-2 h-2 w-2 rounded-full bg-[#32FFB5] ${
                    showType - 3 === i ? "" : "hidden"
                  } shadow-[0px_0px_2px_#32FFB5]`}
                />
                <div className={showType - 3 === i ? "text-white" : "text-[#FFFFFF80]"}>{filter}</div>
              </div>
            ))}
            height={"32px"}
            rounded={"4px"}
            className="!w-[110px] !bg-[#29292B] !font-brand !text-sm !text-white"
            bodyClassName="!bg-none !bg-[#29292B]"
            itemClassName={`hover:!bg-[#48484b] !justify-start !px-2`}
          />
        </div>
      </div>
      <div className="primary-shadow mt-2 flex h-8 w-full flex-none overflow-hidden rounded md:mt-0 md:w-fit md:flex-1">
        <div className="relative flex-1">
          <StyledInput
            value={address}
            setValue={setAddress}
            className="h-full w-full !rounded-none font-brand !shadow-none"
          />
          {!address ? (
            <div
              className={`text-ellpsis absolute left-0 top-0 flex h-full w-full items-center overflow-hidden whitespace-nowrap p-[0px_14px] font-brand !text-sm text-white`}
            >
              Find&nbsp;<span className="text-[#FFFFFF80]">a wallet for swaps in this pair...</span>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className="flex h-full w-14 cursor-pointer items-center justify-center  bg-[#202023] text-primary [&>svg]:!h-4 [&>svg]:!w-4"
          onClick={() => {
            setShowType(6);
            setCriteria(address);
          }}
        >
          {SearchCircleSVG}
        </div>
      </div>
    </div>
  );
}

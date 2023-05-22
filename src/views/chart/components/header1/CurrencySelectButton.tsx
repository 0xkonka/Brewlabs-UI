import CurrencySelector from "@components/CurrencySelector";
import { CircleSVG, ChevronRightVG } from "@components/dashboard/assets/svgs";

import { useGlobalState } from "state";
import { useState } from "react";

const CurrencySelectButton = ({
  onCurrencySelect,
}: {
  onCurrencySelect?: any;
}) => {
  const [inputValue, setInputValue] = useState(null);
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");

  return (
    <div className="h-[34px] w-[95px] flex flex-row items-center justify-center rounded-[6px] bg-[#191d24] max-[480px]:w-full">
      <button
        onClick={() => {
          setIsOpen(isOpen === 1 ? 1 : 2);
          setSidebarContent(
            <CurrencySelector
              inputType={"input"}
              selectedCurrency={inputValue}
              onUserInput={null}
              type={"charts"}
              onCurrencySelect={onCurrencySelect}
            />
          );
        }}
        className="flex w-full justify-between pl-[7px] pt-[6px] pb-[6px] pr-[4px] "
      >
        <div className="flex items-center gap-[8px]">
          <CircleSVG size="22px"/>
          <div className="flex flex-col flex-start max-[480px]:flex-row max-[480px]:gap-[12px] items-start">
            <p className="text-[8px] leading-[9px] font-[700] max-[480px]:text-[12px] max-[480px]:leading-[14px]">BNB</p>
            <p className="text-[8px] leading-[9px] font-[700] max-[480px]:text-[12px] max-[480px]:leading-[14px]">$335.6</p>
          </div>
        </div>
        {ChevronRightVG}
      </button>
    </div>
    
  );
};

export default CurrencySelectButton;

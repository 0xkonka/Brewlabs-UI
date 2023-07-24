import CurrencySelector from "@components/CurrencySelector";
import { useGlobalState } from "state";
import { useContext, useEffect, useState } from "react";
import Modal from "@components/Modal";

import {
  ArrowCircleSVG,
  CircleRightSVG,
  CopySVG,
  DrawSVG,
  ViewListSVG,
  checkCircleSVG,
} from "@components/dashboard/assets/svgs";
import { ChartContext } from "contexts/ChartContext";
import StyledInput from "@components/StyledInput";

export const SearchInput = () => {
  const [criteria, setCriteria] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const onCopyAddress = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(criteria);
  };

  return (
    <div className="flex w-full">
      <div className="primary-shadow flex h-[44px] flex-1 overflow-hidden rounded">
        <div className="flex flex-1 items-center justify-between bg-[#B9B8B81A]">
          <StyledInput
            value={criteria}
            setValue={setCriteria}
            placeholder="Search contract, name, symbol..."
            className="h-full flex-1 bg-transparent !text-base !shadow-none focus:!shadow-none focus:!ring-0"
          />
          <div className="mr-3 text-[#B9B8B8] [&>svg]:!h-5 [&>svg]:!w-5">{CircleRightSVG}</div>
        </div>
        <div className="flex h-full w-[44px] cursor-pointer items-center justify-center bg-[#B9B8B80D] text-primary">
          {DrawSVG}
        </div>
      </div>
      <div
        className="ml-2 flex cursor-pointer items-center text-tailwind transition hover:text-white [&>svg]:!h-4 [&>svg]:!w-4"
        onClick={() => onCopyAddress()}
      >
        {!isCopied ? CopySVG : checkCircleSVG}
      </div>
    </div>
  );
};

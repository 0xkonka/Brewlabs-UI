import { useEffect, useState } from "react";

import { CircleRightSVG, CopySVG, DrawSVG, checkCircleSVG } from "@components/dashboard/assets/svgs";
import StyledInput from "@components/StyledInput";
import { useTokenAllPairs } from "@hooks/useTokenAllPairs";
import { getChainLogo, getDexLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import TokenLogo from "@components/logo/TokenLogo";

export const SearchInput = ({ selectedChainId, selectedCurrency, setSelectedCurrency }) => {
  const [criteria, setCriteria] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const onCopyAddress = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(criteria);
  };

  const pairs = useTokenAllPairs(criteria, selectedChainId);

  return (
    <div className="relative z-10 flex w-full">
      <div className="primary-shadow flex h-[44px] flex-1">
        <div className="relative flex-1">
          <div className=" flex items-center justify-between overflow-hidden rounded-l bg-[#B9B8B81A]">
            <StyledInput
              value={criteria}
              setValue={setCriteria}
              placeholder="Search contract, name, symbol..."
              className="!h-full flex-1 bg-transparent !p-[14px] !text-base !shadow-none focus:!shadow-none focus:!ring-0"
            />
            <div className="mr-3 text-[#B9B8B8] [&>svg]:!h-5 [&>svg]:!w-5">{CircleRightSVG}</div>
          </div>
          <div className="absolute left-0 w-full overflow-hidden rounded-b bg-[#202023]">
            {pairs.map((pair, i) => {
              return (
                <div
                  key={i}
                  className="flex h-12 cursor-pointer items-center px-3 transition hover:bg-[#39393b]"
                  onClick={() => {
                    setSelectedCurrency(pair);
                    setCriteria("");
                  }}
                >
                  <div className="relative">
                    <img src={getChainLogo(pair.chainId)} alt={""} className="primary-shadow h-6 w-6 rounded-full" />
                    <img
                      src={getDexLogo(pair.swap)}
                      alt={""}
                      className="primary-shadow absolute -right-1 -top-1 h-4 w-4 rounded-full"
                    />
                  </div>
                  <div className="mx-2 flex flex-1 items-center justify-between text-sm leading-none">
                    <div className="text-[#FFFFFFBF]">
                      <div>
                        <span className="text-white">{pair.symbols[0]}</span> ({pair.symbols[1]})
                      </div>
                      <div className="text-xs">{pair.tokenAddresses[0]}</div>
                    </div>
                    <div className="text-right">
                      <div>
                        {pair.symbols[0]} <span className="text-white">${pair.price.toFixed(3)}</span>
                      </div>
                      <div className={`text-xs ${pair.priceChange24h >= 0 ? "text-green" : "text-danger"}`}>
                        ({pair.priceChange24h >= 0 ? "+" : ""}
                        {pair.priceChange24h.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  <TokenLogo
                    src={getTokenLogoURL(isAddress(pair.tokenAddresses[0]), pair.chainId)}
                    classNames="primary-shadow h-6 w-6 rounded-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex h-full w-[44px] cursor-pointer items-center justify-center rounded-r bg-[#B9B8B80D] text-primary">
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

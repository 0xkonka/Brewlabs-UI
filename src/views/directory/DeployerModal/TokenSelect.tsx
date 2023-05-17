/* eslint-disable react-hooks/exhaustive-deps */

import { useActiveChainId } from "@hooks/useActiveChainId";
import { DashboardContext } from "contexts/DashboardContext";
import { useContext, useRef, useState } from "react";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { useGlobalState } from "state";
import CurrencySelector from "@components/CurrencySelector";

import { Token } from "@brewlabs/sdk";
import { getAddress } from "@ethersproject/address";
import { DrawSVG } from "@components/dashboard/assets/svgs";

const TokenSelect = ({ selectedCurrency, setSelectedCurrency }) => {
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");
  const [inputValue, setInputValue] = useState(null);

  const { tokens }: any = useContext(DashboardContext);
  const { chainId } = useActiveChainId();
  const dropdownRef: any = useRef();

  function onUserInput(input, currency) {}
  function onCurrencySelect(input, currency) {
    setSelectedCurrency(currency);
  }

  let wrappedTokens = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") continue;
    const token = new Token(
      chainId,
      getAddress(tokens[i].address),
      tokens[i].decimals,
      tokens[i].symbol,
      tokens[i].name
    );
    wrappedTokens.push(token);
  }
  return (
    <div className="relative z-20" ref={dropdownRef}>
      <div
        className={`flex h-[36px] cursor-pointer items-center justify-between overflow-hidden rounded-md bg-[#B9B8B81A] pl-3.5`}
        onClick={() => {
          setIsOpen(isOpen === 1 ? 1 : 2);
          setSidebarContent(
            <CurrencySelector
              inputType={"input"}
              selectedCurrency={inputValue}
              onUserInput={onUserInput}
              type={""}
              onCurrencySelect={onCurrencySelect}
              filteredCurrencies={wrappedTokens}
            />
          );
        }}
      >
        {selectedCurrency ? (
          <div className="flex flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap">
            <img
              src={getTokenLogoURL(selectedCurrency.address, chainId)}
              alt={""}
              className="h-6 w-6 rounded-full"
              onError={(e: any) => (e.target.src = "/images/unknown.png")}
            />
            <div className="mx-4 w-[100px] xsm:w-[140px]">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#FFFFFFBF]">
                {selectedCurrency.symbol}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 text-sm font-medium">Select Token...</div>
        )}
        <div className="flex h-full w-10 items-center justify-center bg-[rgb(35,40,52)] text-primary">{DrawSVG}</div>
      </div>
    </div>
  );
};

export default TokenSelect;

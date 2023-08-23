import { useContext, useEffect, useMemo, useState } from "react";

import { CircleRightSVG, CopySVG, DrawSVG, checkCircleSVG } from "@components/dashboard/assets/svgs";
import StyledInput from "@components/StyledInput";
import { fetchAllPairs, useTokenAllPairs } from "@hooks/useTokenAllPairs";
import { getChainLogo, getDexLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import TokenLogo from "@components/logo/TokenLogo";
import CurrencySelector from "@components/CurrencySelector";
import { useGlobalState } from "state";
import { Oval } from "react-loader-spinner";
import { ChartContext } from "contexts/ChartContext";
import { useRouter } from "next/router";
import { DEX_GURU_CHAIN_NAME } from "config";

export const SearchInput = ({ setSelectedCurrency }) => {
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");
  const { criteria, setCriteria }: any = useContext(ChartContext);

  const { pairs, loading } = useTokenAllPairs(criteria);
  const router = useRouter();

  function onUserInput(input, currency) {}
  async function onCurrencySelect(input, currency) {
    router.push(`/chart/${DEX_GURU_CHAIN_NAME[currency.chainId]}/${currency.address}`);
  }

  return (
    <div className="relative z-10 flex w-full">
      <div className="primary-shadow flex h-[44px] flex-1">
        <div className="relative flex-1">
          <div className=" relative flex h-full items-center justify-between overflow-hidden rounded-l bg-[#B9B8B81A]">
            <StyledInput
              value={criteria}
              setValue={setCriteria}
              className="!h-full flex-1 bg-transparent  font-brand !text-base !shadow-none focus:!shadow-none focus:!ring-0"
              onClick={() => {
                setIsOpen(isOpen === 1 ? 1 : 2);
                setSidebarContent(
                  <CurrencySelector
                    inputType={"input"}
                    selectedCurrency={null}
                    onUserInput={onUserInput}
                    type={""}
                    onCurrencySelect={onCurrencySelect}
                  />
                );
              }}
            />
            {!criteria ? (
              <div
                className={`absolute left-0 top-0 flex h-full w-full items-center overflow-hidden text-ellipsis whitespace-nowrap p-[0px_14px] font-brand !text-base text-[#FFFFFFBF]`}
              >
                Search&nbsp;<span className="text-[#FFFFFF40]">contract, name, symbol...</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="absolute left-0 w-full overflow-hidden rounded-b bg-[#29292b]">
            {loading ? (
              <div className="flex h-[80px] w-full items-center justify-center">
                <Oval
                  width={30}
                  height={30}
                  color={"white"}
                  secondaryColor="black"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
              </div>
            ) : (
              pairs.map((pair, i) => {
                return (
                  <div
                    key={i}
                    className="flex h-[44px] cursor-pointer items-center overflow-hidden text-ellipsis px-3 transition hover:bg-[#5b5b5c]"
                    onClick={() => {
                      router.push(`/chart/${DEX_GURU_CHAIN_NAME[pair.chainId]}/${pair.address}`);
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
                    <div
                      className={`mx-2 flex flex-1 items-center justify-between ${
                        i !== pairs.length - 1 ? "border-b border-dotted border-[#D9D9D980]" : ""
                      } h-full overflow-hidden text-ellipsis text-sm leading-none`}
                    >
                      <div className="flex-1 overflow-hidden text-ellipsis text-[#FFFFFFBF]">
                        <div>
                          <span className="text-white">{pair.symbols[0]}</span> ({pair.symbols[1]})
                        </div>
                        <div className="overflow-hidden text-ellipsis text-xs">{pair.address}</div>
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
              })
            )}
          </div>
        </div>
        <div
          className="flex h-full w-[44px] cursor-pointer items-center justify-center rounded-r bg-[#B9B8B80D] text-primary"
          onClick={() => {
            setIsOpen(isOpen === 1 ? 1 : 2);
            setSidebarContent(
              <CurrencySelector
                inputType={"input"}
                selectedCurrency={null}
                onUserInput={onUserInput}
                type={""}
                onCurrencySelect={onCurrencySelect}
              />
            );
          }}
        >
          {DrawSVG}
        </div>
      </div>
    </div>
  );
};

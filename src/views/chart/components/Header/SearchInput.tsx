import { useContext } from "react";

import { DrawSVG } from "@components/dashboard/assets/svgs";
import StyledInput from "@components/StyledInput";
import { useTokenAllPairs } from "@hooks/useTokenAllPairs";
import CurrencySelector from "@components/CurrencySelector";
import { useGlobalState } from "state";
import { Oval } from "react-loader-spinner";
import { ChartContext } from "contexts/ChartContext";
import { useRouter } from "next/router";
import { DEX_GURU_CHAIN_NAME } from "config";
import { PairItem } from "./PairItem";

export const SearchInput = () => {
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
                return <PairItem key={i} pair={pair} isLast={i === pairs.length - 1} setCriteria={setCriteria} />;
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

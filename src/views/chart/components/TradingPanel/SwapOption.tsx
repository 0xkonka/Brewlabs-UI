import SwapPanel from "views/swap/SwapPanel";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { useContext, useState } from "react";
import { formatAmount } from "utils/formatApy";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import { DashboardContext } from "contexts/DashboardContext";
import { BigNumberFormat } from "utils/functions";
import TokenLogo from "@components/logo/TokenLogo";

export default function SwapOption({ currency, marketInfos }) {
  const [showType, setShowType] = useState(0);
  const histories = {
    vol: {
      "5m": { buys: 1138, sells: 138, isUp: true },
      "30m": { buys: 12332, sells: 2332, isUp: false },
      "24hr": { buys: 61330, sells: 161330, isUp: true },
      "7d": { buys: 1420000, sells: 1120000, isUp: false },
    },
  };
  const showTypes = [{ key: "vol", values: ["buys", "sells"] }];
  const { tokens }: any = useContext(DashboardContext);
  const exisitingToken = tokens && tokens.map((token) => token.address === currency.tokenAddresses[0].toLowerCase());

  return (
    <div className="flex w-fit flex-col sm:w-full sm:flex-row 2xl:sm:flex-col">
      <div className="primary-shadow flex h-fit w-[320px] flex-col gap-1 rounded-[6px] bg-[#B9B8B80D] p-3 2xl:w-full">
        <SwapPanel />
      </div>
      <div className="ml-0 mt-0 w-[320px] flex-1 sm:ml-4 sm:w-fit 2xl:sm:ml-0 2xl:mt-2 2xl:flex-none">
        {/* <div className="primary-shadow rounded-[6px] bg-[#B9B8B80D] p-3">
          <div className="flex items-center justify-between">
            <DropDown
              value={showType}
              setValue={setShowType}
              data={showTypes.map((data) => data.key.toUpperCase())}
              className="!w-[70px] !bg-[#29292C] text-white"
              bodyClassName="!bg-none !bg-[#29292C]"
              itemClassName="hover:!bg-[#86868644]"
            />
            {Object.keys(histories[showTypes[showType].key]).map((key, i) => {
              return (
                <div
                  key={i}
                  className={`w-12 text-right ${
                    histories[showTypes[showType].key][key].isUp ? " text-[#3AFDB7]" : "text-[#DC4545]"
                  }`}
                >
                  {key.toUpperCase()}
                </div>
              );
            })}
          </div>
          <div className="py-2">
            {showTypes[showType].values.map((data, i) => {
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between py-1.5 ${
                    i === showTypes[showType].values.length - 1 ? "" : "border-b border-[#FFFFFF40]"
                  }`}
                >
                  <div className={`w-[70px] uppercase ${i % 2 === 0 ? " text-[#3AFDB7]" : "text-[#DC4545]"}`}>
                    {data}
                  </div>
                  {Object.keys(histories[showTypes[showType].key]).map((key, i) => {
                    return (
                      <div key={i} className="w-12 text-right text-sm text-white">
                        {formatAmount(histories[showTypes[showType].key][key][data])}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div> */}
        <div className="primary-shadow mt-2 flex items-center rounded-[6px] w-[320px] bg-[#B9B8B80D] p-3">
          <TokenLogo
            src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
            classNames="primary-shadow h-8 w-8 rounded-full"
          />

          <div className="ml-2">
            <div className="text-sm leading-none text-white">
              {BigNumberFormat(exisitingToken ? exisitingToken.balance : 0)} {currency.symbols[0]} Balance
            </div>
            <div className="mt-0.5 text-xs leading-none text-[#FFFFFF80]">
              {exisitingToken ? BigNumberFormat(exisitingToken.balance * exisitingToken.price) : 0} USD
            </div>
          </div>
        </div>
        <div className="primary-shadow mt-2 w-full rounded-[6px] bg-[#B9B8B80D] p-3 text-[#FFFFFFBF]">
          <div>Description</div>
          <div className="line-clamp-[7] overflow-hidden text-ellipsis text-xs">{marketInfos?.info?.description}</div>
        </div>
      </div>
    </div>
  );
}

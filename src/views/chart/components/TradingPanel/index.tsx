import SwapPanel from "views/swap/SwapPanel";
import TradingViewChart from "./TradingViewChart";
import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { useState } from "react";
import { formatAmount } from "utils/formatApy";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import FavouritePanel from "./FavouritePanel";

export default function TradingPanel({ currency }) {
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
  return (
    <div className="mt-6">
      <div className="flex">
        <div className="w-[320px]">
          <div className="primary-shadow flex h-fit w-full flex-col gap-1 rounded-[6px] bg-[#B9B8B80D] p-3">
            <SwapPanel />
          </div>
          <div className="primary-shadow mt-2 rounded-[6px] bg-[#B9B8B80D] p-3">
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
          </div>
          <div className="primary-shadow mt-2 flex items-center rounded-[6px] bg-[#B9B8B80D] p-3">
            <img
              src={getTokenLogoURL(isAddress(currency.token0.address), currency.token0.chainId)}
              alt={""}
              className="primary-shadow h-8 w-8 rounded-full"
            />
            <div className="ml-2">
              <div className="text-sm leading-none text-white">273.82k {currency.token0.symbol} Balance</div>
              <div className="mt-0.5 text-xs leading-none text-[#FFFFFF80]">50,820.22 USD</div>
            </div>
          </div>
          <div className="primary-shadow mt-2 w-full rounded-[6px] bg-[#B9B8B80D] p-3 text-[#FFFFFFBF]">
            <div>Description</div>
            <div className="text-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit ....
            </div>
          </div>
        </div>
        <div className="h-[700px] flex-1 mx-4">
          <TradingViewChart />
        </div>
        <FavouritePanel />
      </div>
    </div>
  );
}

import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { useState } from "react";
import { useTradingHistory } from "@hooks/useTokenInfo";
import { BigNumberFormat } from "utils/functions";

export default function VolumeInfo({ currency }) {
  const [showType, setShowType] = useState(0);
  const { histories: data } = useTradingHistory(
    currency.tokenAddresses[0],
    currency.chainId,
    currency.address,
    currency.swap,
    3600 * 24 * 7 * 1000
  );

  // const data = [];
  function getVolume(period) {
    let buyVolume = 0,
      sellVolume = 0;

    const sellCount = data
      .filter(
        (history) =>
          history.fromAddress === currency.tokenAddresses[0].toLowerCase() &&
          Number(history.timestamp) >= Date.now() / 1000 - period
      )
      .map((history) => (sellVolume += history.amountStable)).length;

    const buyCount = data
      .filter(
        (history) =>
          history.fromAddress !== currency.tokenAddresses[0].toLowerCase() &&
          Number(history.timestamp) >= Date.now() / 1000 - period
      )
      .map((history) => (buyVolume += history.amountStable)).length;

    return {
      buyVolume,
      sellVolume,
      buyCount,
      sellCount,
      totalCount: buyCount + sellCount,
      totalVolume: buyVolume + sellVolume,
    };
  }
  const histories = {
    vol: {
      "5m": {
        buys: getVolume(5 * 60).buyCount,
        sells: getVolume(5 * 60).sellCount,
        total: getVolume(5 * 60).totalCount,
        isUp: getVolume(5 * 60).buyCount >= getVolume(5 * 60).sellCount,
      },
      "30m": {
        buys: getVolume(30 * 60).buyCount,
        sells: getVolume(30 * 60).sellCount,
        total: getVolume(30 * 60).totalCount,
        isUp: getVolume(30 * 60).buyCount >= getVolume(30 * 60).sellCount,
      },
      "24hr": {
        buys: getVolume(24 * 3600).buyCount,
        sells: getVolume(24 * 3600).sellCount,
        total: getVolume(24 * 3600).totalCount,
        isUp: getVolume(24 * 3600).buyCount >= getVolume(24 * 3600).sellCount,
      },
      "7d": {
        buys: getVolume(3600 * 24 * 7).buyCount,
        sells: getVolume(3600 * 24 * 7).sellCount,
        total: getVolume(3600 * 24 * 7).totalCount,
        isUp: getVolume(3600 * 24 * 7).buyCount >= getVolume(3600 * 24 * 7).sellCount,
      },
    },
    "vol(usd)": {
      "5m": {
        buys: getVolume(5 * 60).buyVolume,
        sells: getVolume(5 * 60).sellVolume,
        isUp: getVolume(5 * 60).buyVolume >= getVolume(5 * 60).sellVolume,
        total: getVolume(5 * 60).totalVolume,
      },
      "30m": {
        buys: getVolume(30 * 60).buyVolume,
        sells: getVolume(30 * 60).sellVolume,
        isUp: getVolume(30 * 60).buyVolume >= getVolume(30 * 60).sellVolume,
        total: getVolume(30 * 60).totalVolume,
      },
      "24hr": {
        buys: getVolume(24 * 3600).buyVolume,
        sells: getVolume(24 * 3600).sellVolume,
        isUp: getVolume(24 * 3600).buyVolume >= getVolume(24 * 3600).sellVolume,
        total: getVolume(24 * 3600).totalVolume,
      },
      "7d": {
        buys: getVolume(3600 * 24 * 7).buyVolume,
        sells: getVolume(3600 * 24 * 7).sellVolume,
        isUp: getVolume(3600 * 24 * 7).buyVolume >= getVolume(3600 * 24 * 7).sellVolume,
        total: getVolume(3600 * 24 * 7).totalVolume,
      },
    },
  };
  const showTypes = [
    { key: "vol", values: ["buys", "sells", "total"] },
    { key: "vol(usd)", values: ["buys", "sells", "total"] },
  ];

  return (
    <div className="primary-shadow rounded-[6px] bg-[#B9B8B80D] p-3">
      <div className="flex items-center">
        <DropDown
          value={showType}
          setValue={setShowType}
          data={showTypes.map((data) => data.key.toUpperCase())}
          className="!w-[84px] !bg-[#29292C] !text-xs text-white"
          bodyClassName="!bg-none !bg-[#29292C]"
          itemClassName="hover:!bg-[#86868644]"
        />
        <div className="items-center flex flex-1 justify-between">
          {Object.keys(histories[showTypes[showType].key]).map((key, i) => {
            return (
              <div
                key={i}
                className={`flex-1 text-right text-sm ${
                  histories[showTypes[showType].key][key].isUp ? " text-[#3AFDB7]" : "text-[#DC4545]"
                }`}
              >
                {key.toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-2">
        {showTypes[showType].values.map((data, i) => {
          return (
            <div
              key={i}
              className={`flex py-1.5 text-sm ${
                i === showTypes[showType].values.length - 1 ? "" : "border-b border-[#FFFFFF40]"
              }`}
            >
              <div
                className={`w-[90px] uppercase ${
                  i < 2 ? (i % 2 === 0 ? " text-[#3AFDB7]" : "text-[#DC4545]") : "text-white"
                }`}
              >
                {data}
              </div>
              <div className="flex flex-1 items-center justify-between">
                {Object.keys(histories[showTypes[showType].key]).map((key, i) => {
                  return (
                    <div key={i} className="flex-1 text-right text-[11px] text-white">
                      {BigNumberFormat(histories[showTypes[showType].key][key][data], showType ? 2 : 0)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

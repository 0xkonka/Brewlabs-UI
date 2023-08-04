import DropDown from "views/directory/IndexDetail/Dropdowns/Dropdown";
import { useState } from "react";
import { formatAmount } from "utils/formatApy";
import { useTradingHistory } from "@hooks/useTokenInfo";

export default function VolumeInfo({ currency }) {
  const [showType, setShowType] = useState(0);
  const { histories: data } = useTradingHistory(
    currency.tokenAddresses[0],
    currency.chainId,
    currency.address,
    currency.swap,
    3600 * 24 * 7 * 1000,
    1000
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

    return { buyVolume, sellVolume, buyCount, sellCount };
  }
  const histories = {
    v: {
      "5m": {
        buys: getVolume(5 * 60).buyCount,
        sells: getVolume(5 * 60).sellCount,
        isUp: getVolume(5 * 60).buyCount >= getVolume(5 * 60).sellCount,
      },
      "30m": {
        buys: getVolume(30 * 60).buyCount,
        sells: getVolume(30 * 60).sellCount,
        isUp: getVolume(30 * 60).buyCount >= getVolume(30 * 60).sellCount,
      },
      "24hr": {
        buys: getVolume(24 * 3600).buyCount,
        sells: getVolume(24 * 3600).sellCount,
        isUp: getVolume(24 * 3600).buyCount >= getVolume(24 * 3600).sellCount,
      },
      "7d": {
        buys: getVolume(3600 * 24 * 7).buyCount,
        sells: getVolume(3600 * 24 * 7).sellCount,
        isUp: getVolume(3600 * 24 * 7).buyCount >= getVolume(3600 * 24 * 7).sellCount,
      },
    },
    "v(usd)": {
      "5m": {
        buys: getVolume(5 * 60).buyVolume,
        sells: getVolume(5 * 60).sellVolume,
        isUp: getVolume(5 * 60).buyVolume >= getVolume(5 * 60).sellVolume,
      },
      "30m": {
        buys: getVolume(30 * 60).buyVolume,
        sells: getVolume(30 * 60).sellVolume,
        isUp: getVolume(30 * 60).buyVolume >= getVolume(30 * 60).sellVolume,
      },
      "24hr": {
        buys: getVolume(24 * 3600).buyVolume,
        sells: getVolume(24 * 3600).sellVolume,
        isUp: getVolume(24 * 3600).buyVolume >= getVolume(24 * 3600).sellVolume,
      },
      "7d": {
        buys: getVolume(3600 * 24 * 7).buyVolume,
        sells: getVolume(3600 * 24 * 7).sellVolume,
        isUp: getVolume(3600 * 24 * 7).buyVolume >= getVolume(3600 * 24 * 7).sellVolume,
      },
    },
  };
  const showTypes = [
    { key: "v", values: ["buys", "sells"] },
    { key: "v(usd)", values: ["buys", "sells"] },
  ];

  return (
    <div className="primary-shadow rounded-[6px] bg-[#B9B8B80D] p-3">
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
              <div className={`w-[70px] uppercase ${i % 2 === 0 ? " text-[#3AFDB7]" : "text-[#DC4545]"}`}>{data}</div>
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
  );
}

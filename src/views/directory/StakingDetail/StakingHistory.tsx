/* eslint-disable react-hooks/exhaustive-deps */

import { PoolCategory } from "config/constants/types";
import { formatAmount } from "utils/formatApy";
import CountDown from "./CountDown";

const StakingHistory = ({
  history,
  type,
  onWithdraw,
  setPopulatedAmount,
}: {
  history: any;
  type: PoolCategory;
  onWithdraw: any;
  setPopulatedAmount: any;
}) => {
  return (
    <div className="h-[300px] overflow-x-scroll text-[#FFFFFFBF]">
      <div className="flex justify-between text-xl">
        <div className="min-w-[150px]">Stake</div>
        <div className="min-w-[60px]">Block</div>
        <div className="min-w-[80px] text-right">Lock</div>
      </div>
      <div className="mt-2 h-[1px] w-full bg-[#FFFFFF80]" />
      <div>
        {history.map((data, i) => {
          return (
            <div className="flex items-center justify-between border-b border-b-[#FFFFFF40] py-2.5" key={i}>
              <div className="min-w-[150px]">
                {formatAmount(data.amount.toString())} <span className="text-primary">{data.symbol}</span>
              </div>
              <div className="min-w-[60px]">{data.blockNumber}</div>
              <div className="min-w-[80px] text-right">
                {type === PoolCategory.CORE ? (
                  <>N/A</>
                ) : (
                  <CountDown
                    time={data.unlockTime}
                    onWithdraw={() => {
                      setPopulatedAmount("0")
                      setPopulatedAmount(data.amount.toString());
                      onWithdraw();
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StakingHistory;

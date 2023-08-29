/* eslint-disable react-hooks/exhaustive-deps */
import NFTComponent from "@components/NFTComponent";
import { useActiveNFT } from "views/nft/hooks/useActiveNFT";

export default function MomentumInfo({ volumeDatas }) {
  const buyAmount = volumeDatas["txn (usd)"]["7d"].Buys;
  const sellAmount = volumeDatas["txn (usd)"]["7d"].Sells;
  const max = buyAmount > sellAmount ? 1 : 0;
  const buyPercent = (buyAmount / (buyAmount + sellAmount)) * 100;
  const sellPercent = (sellAmount / (buyAmount + sellAmount)) * 100;
  const activeRarity = useActiveNFT();
  return activeRarity >= 1 ? (
    <div className="primary-shadow mt-2 rounded-md bg-[#B9B8B80D] p-[8px_16px_16px_16px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-base font-bold text-white">7D Momentum</div>
        </div>
        <div className="flex items-center">
          <NFTComponent />
        </div>
      </div>
      <div className="my-2 text-sm text-[#FFFFFFBF]">Volume price direction over 7 days.</div>
      <div className="mx-auto flex max-w-[288px] items-center text-sm">
        <div className="text-white  ">Sellers</div>
        <div className="mx-4 flex flex-1 items-center">
          <div
            className={`primary-shadow mx-[1px] h-2 ${max === 0 ? `h-3.5` : "flex-1"} tooltip cursor-pointer`}
            data-tip={sellPercent.toFixed(2) + "%"}
            style={{ background: "#DC4545", width: sellPercent + "%" }}
          ></div>
          <div
            className={`primary-shadow mx-[1px] h-2 ${max === 1 ? `h-3.5` : `flex-1`} tooltip cursor-pointer`}
            data-tip={buyPercent.toFixed(2) + "%"}
            style={{ background: "#32FFB5", width: buyPercent + "%" }}
          ></div>
        </div>
        <div className="text-white">Buyers</div>
      </div>
    </div>
  ) : (
    <div />
  );
}

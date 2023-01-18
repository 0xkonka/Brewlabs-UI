import { useState } from "react";
import clsx from "clsx";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useUserHistory } from "hooks/bridge/useUserHistory";
import { useSwapHistory } from "hooks/swap/useSwapHIstory";
import { useCurrency } from "hooks/Tokens";
import Card from "./Card";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ETH_ADDRESSES } from "config/constants";
import { EXPLORER_URLS } from "config/constants/networks";

const Row = (data: any) => {
  const {
    data: { id, caller, srcToken, dstToken, spentAmount, returnAmount, transactionHash },
  } = data;
  const inputCurrency = useCurrency(ETH_ADDRESSES.includes(srcToken) ? "ETH" : srcToken);
  const outputCurrency = useCurrency(ETH_ADDRESSES.includes(dstToken) ? "ETH" : dstToken);

  const amount = formatUnits(BigNumber.from(returnAmount), outputCurrency?.decimals);
  const { chainId } = useActiveWeb3React();

  return (
    <div className="flex items-center justify-between select-none">
      <p className="flex">
        {inputCurrency?.symbol}&nbsp;<span className="dark:text-primary">SWAP</span>&nbsp;{outputCurrency?.symbol}
      </p>
      <p className="flex items-center justify-between gap-2">
        <span className="opacity-40">
          {amount}&nbsp;{outputCurrency?.symbol}
        </span>
        <a href={`${EXPLORER_URLS[chainId]}/tx/${transactionHash}`} target="_blank" rel="noreferrer">
          <img src="/images/explorer/etherscan.png" alt="" className="h-3 w-3" />
        </a>
      </p>
    </div>
  );
};

const History = () => {
  const logs = useSwapHistory();
  const { account, chainId } = useActiveWeb3React();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex w-full items-center justify-between px-1">
        <span className="text-lg">Show History</span>
        <ChevronUpIcon className={clsx("h-5 w-5 transition-all dark:text-primary", !isExpanded && "rotate-180")} />
      </button>
      {isExpanded && (
        <div className="px-1">
          <div className="mt-2">
            {logs.map((data, index) => {
              return <Row data={data} key={index} />;
            })}
          </div>
          <div className="flex items-center justify-center gap-2">
            <img src="/images/explorer/etherscan.png" alt="Ether scan logo" className="h-4 w-4" />
            <a
              href={`${EXPLORER_URLS[chainId]}/address/${account}`}
              target="_blank"
              rel="noreferrer"
              className="text-base"
            >
              Visit Wallet
            </a>
          </div>
        </div>
      )}
    </Card>
  );
};

export default History;

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useUserHistory } from "hooks/bridge/useUserHistory";
import { useSwapHistory } from "hooks/swap/useSwapHIstory";
import { useCurrency } from "hooks/Tokens";
import useCollapse from "react-collapsed";
import Card from "./Card";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { ETH_ADDRESSES } from "config/constants";
import { EXPLORER_URLS } from "config/constants/networks";

const Row = (data: any) => {
  const { data: {id, caller, srcToken, dstToken, spentAmount, returnAmount, transactionHash} } = data;
  const inputCurrency = useCurrency(ETH_ADDRESSES.includes(srcToken) ? "ETH" : srcToken);
  const outputCurrency = useCurrency(ETH_ADDRESSES.includes(dstToken) ? "ETH" : dstToken);

  const amount = formatUnits(BigNumber.from(returnAmount), outputCurrency?.decimals);
  const {chainId} = useActiveWeb3React();

  return (
    <div className="flex items-center justify-between">
      <p className="flex">
        {inputCurrency?.symbol}&nbsp;<span className="dark:text-primary">SWAP</span>&nbsp;{outputCurrency?.symbol}
      </p>
      <p className="flex items-center justify-between gap-2">
        <span className="opacity-40">
          {amount}&nbsp;{outputCurrency?.symbol}
        </span>
        <a href={`${EXPLORER_URLS[chainId]}/tx/${transactionHash}`} target="_blank" rel="noreferrer"><img src="/images/explorer/etherscan.png" alt="" className="h-3 w-3" /></a>
      </p>
    </div>
  );
};

const History = () => {
  const {chainId} = useActiveWeb3React();
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const { account } = useActiveWeb3React();

  const logs = useSwapHistory();

  return (
    <Card>
      <div className="flex justify-between px-1" {...getToggleProps()}>
        <div className="text-lg">Show History</div>
        {!isExpanded && <ChevronDownIcon className="h-5 w-5 dark:text-primary" />}
        {isExpanded && <ChevronUpIcon className="h-5 w-5 dark:text-primary" />}
      </div>
      <div className="px-1" {...getCollapseProps()}>
        <div className="mt-2">
          {logs.map((data, index) => {
            return <Row data={data} key={index} />;
          })}
        </div>
        <div className="flex items-center justify-center gap-2">
          <img src="/images/explorer/etherscan.png" alt="" className="h-4 w-4" />
          <a href={`${EXPLORER_URLS[chainId]}/address/${account}`} target="_blank" rel="noreferrer" className="text-base">Visit Wallet</a>
        </div>
      </div>
    </Card>
  );
};

export default History;

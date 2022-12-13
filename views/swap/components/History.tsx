import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useUserHistory } from "hooks/bridge/useUserHistory";
import useCollapse from "react-collapsed";
import Card from "./Card";

const History = () => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

  const { transfers, allTransfers } = useUserHistory();

  const transactions = [
    {
      inputCurrency: "ETH",
      outputCurrency: "IXP",
      amount: 125487,
    },
    {
      inputCurrency: "ETH",
      outputCurrency: "IXP",
      amount: 125487,
    },
    {
      inputCurrency: "ETH",
      outputCurrency: "IXP",
      amount: 125487,
    },
    {
      inputCurrency: "ETH",
      outputCurrency: "IXP",
      amount: 125487,
    },
    {
      inputCurrency: "ETH",
      outputCurrency: "IXP",
      amount: 125487,
    },
    {
      inputCurrency: "ETH",
      outputCurrency: "IXP",
      amount: 125487,
    },
  ];

  return (
    <Card>
      <div className="flex justify-between px-1" {...getToggleProps()}>
        <div className="text-lg">Show History</div>
        {!isExpanded && <ChevronDownIcon className="h-5 w-5 dark:text-primary" />}
        {isExpanded && <ChevronUpIcon className="h-5 w-5 dark:text-primary" />}
      </div>
      <div className="px-1" {...getCollapseProps()}>
        <div className="mt-2">
          {transactions.map((txn, index) => {
            const { inputCurrency, outputCurrency, amount } = txn;
            return (
              <div className="flex items-center justify-between" key={index}>
                <p className="flex">
                  {inputCurrency}&nbsp;<span className="dark:text-primary">SWAP</span>&nbsp;{outputCurrency}
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="opacity-40">
                    {amount}&nbsp;{outputCurrency}
                  </span>
                  <img src="/images/explorer/etherscan.png" alt="" className="h-3 w-3" />
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2">
          <img src="/images/explorer/etherscan.png" alt="" className="h-4 w-4" />
          <button className="text-base">Visit Wallet</button>
        </div>
      </div>
    </Card>
  );
};

export default History;

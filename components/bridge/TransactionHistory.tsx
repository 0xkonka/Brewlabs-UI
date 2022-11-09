import TransactionCard, { mockTransactions } from "../cards/TransactionCard";

const TransactionHistory = () => (
  <div className="my-20">
    <h2 className="font-brand text-3xl text-slate-600 dark:text-slate-400">Transaction history</h2>

    <div className="no-scrollbar -ml-8 overflow-x-auto p-8">
      <div className="flex flex-row-reverse justify-end">
        {mockTransactions.map((item) => (
          <TransactionCard
            key={item.id}
            fromChain={item.fromChain}
            toChain={item.toChain}
            direction={item.direction}
            amount={item.amount}
            date={item.date}
            tax={item.tax}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TransactionHistory;

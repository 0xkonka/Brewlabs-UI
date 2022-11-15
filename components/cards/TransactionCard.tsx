import Card from "./Card";
import { motion } from "framer-motion";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

export const mockTransactions = [
  {
    id: 213,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },
  {
    id: 6565,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },
  {
    id: 4674,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },
  {
    id: 1634,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },
  {
    id: 46562,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },

  {
    id: 67674,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },
  {
    id: 4454,
    fromChain: "BSB",
    toChain: "ETH",
    date: "10 October 2022, 15:34",
    amount: "64534",
    direction: "in",
    tax: {
      sending: "0.5465",
      receiving: "0.565845",
    },
  },
] as TransactionCardProps[];

type TransactionCardProps = {
  id?: number;
  fromChain: string;
  toChain: string;
  date: string;
  amount: string;
  direction: "in" | "out";
  tax: {
    sending: string;
    receiving: string;
  };
};

const TransactionCard = ({ fromChain, toChain, date, amount, direction, tax }: TransactionCardProps) => (
  <motion.div
    initial={{ zIndex: 1, filter: "blur(0.5px)" }}
    whileHover={{ zIndex: 100, scale: 1.2, filter: "blur(0px)" }}
    whileTap={{ zIndex: 100, scale: 1.1 }}
    transition={{ delay: 0.1, type: "spring", damping: 30, stiffness: 200 }}
  >
    <Card>
      <div className="mb-5 flex gap-3">
        <div className="-ml-5 -mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 bg-opacity-80 shadow-lg shadow-green-900 dark:bg-zinc-900">
          <div className="h-2 w-2 rounded-full bg-green-300" />
        </div>

        <header>
          <h4 className="flex items-center gap-3 text-xl dark:text-slate-500">
            {fromChain} <ChevronDoubleRightIcon className="h-4 w-4" /> {toChain}
          </h4>
          <h5 className=" text-gray-500">{date}</h5>
        </header>
      </div>

      <ul className="gap-t-3 ml-6 mb-4 flex flex-col divide-y-2 divide-dotted divide-gray-700 text-sm text-gray-500">
        <li>Amount: {amount}</li>
        <li>Direction: {direction}</li>
        <li>Sending Tax: {tax.sending}</li>
        <li>Receiving Tax: {tax.receiving}</li>
      </ul>
    </Card>
  </motion.div>
);

export default TransactionCard;

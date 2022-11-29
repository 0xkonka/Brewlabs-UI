import Card from "./Card";
import { motion } from "framer-motion";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { SerializedToken } from "config/constants/types";
import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { getExplorerLink } from "lib/bridge/helpers";
import { truncateHash } from "utils";
import { CHAIN_ICONS } from "config/constants/networks";
import Image from "next/image";

type TransactionCardProps = {
  chainId: ChainId;
  fromToken: SerializedToken;
  toToken: SerializedToken;
  timestamp: string;
  amount: string;
  sendingTx: string;
  receivingTx?: string;
  status: boolean;
  user: string;
  message: {
    txHash: string;
    messageId: string;
  };
};

const TransactionCard = ({
  chainId,
  fromToken,
  toToken,
  amount,
  message,
  timestamp,
  sendingTx,
  receivingTx,
  status,
}: TransactionCardProps) => {
  const dateStr = new Date(parseInt(timestamp, 10) * 1000).toLocaleTimeString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
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
              {fromToken.symbol} <ChevronDoubleRightIcon className="h-4 w-4" /> {toToken.symbol}
            </h4>
            <h5 className="text-gray-500">{dateStr}</h5>
          </header>
        </div>

        <ul className="gap-t-3 ml-6 mb-4 flex flex-col divide-y-2 divide-dotted divide-gray-700 text-sm text-gray-500">
          <li>Amount: {ethers.utils.formatUnits(amount, fromToken.decimals).toString()}</li>
          <li>
            <div className="flex items-center">
              <span className="mr-2">Direction:</span>
              <Image src={CHAIN_ICONS[fromToken.chainId]} alt="" width={15} height={15} unoptimized priority />
              <span className="mx-1">{`=>`}</span>
              <Image src={CHAIN_ICONS[toToken.chainId]} alt="" width={15} height={15} unoptimized priority />
            </div>
          </li>
          <li>
            Sending Tx:{" "}
            <a
              href={getExplorerLink(fromToken.chainId, "transaction", sendingTx)}
              className="dark:text-gray-500"
              target="_blank"
              rel="noreferrer"
            >
              {truncateHash(sendingTx)}
            </a>
          </li>
          {receivingTx ? (
            <>
              <li>
                Receiving Tx:{" "}
                <a
                  href={getExplorerLink(toToken.chainId, "transaction", receivingTx ?? "")}
                  className="dark:text-gray-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  {truncateHash(receivingTx ?? "")}
                </a>
              </li>
              <li>Tax: 0.1%</li>
            </>
          ) : (
            <li className="text-center">
              <button className="mt-2 items-center justify-center rounded-md bg-dark px-4 py-1 text-base font-bold tracking-wider text-brand shadow-sm transition hover:bg-brand hover:text-dark">
                Claim
              </button>
            </li>
          )}
        </ul>
      </Card>
    </motion.div>
  );
};

export default TransactionCard;

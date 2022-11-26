import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { SerializedToken } from "config/constants/types";
import { ChainId } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { getExplorerLink } from "lib/bridge/helpers";
import { truncateHash } from "utils";
import { CHAIN_ICONS } from "config/constants/networks";
import Image from "next/image";
import { useUserHistory } from "hooks/bridge/useUserHistory";
import CrossChainIcons from "../CrossChainIcons";

import { NetworkOptions } from "config/constants/networks";

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

const dateToString = (timestamp: string) => {
  return new Date(parseInt(timestamp, 10) * 1000).toLocaleTimeString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const History = ({ historyData }: any) => {
  const { transfers, allTransfers, loading } = useUserHistory();

  console.log(loading);
  console.log(allTransfers);

  // const { chainId, fromToken, toToken, amount, message, timestamp, sendingTx, receivingTx, status } = historyData;

  // console.log(historyData);

  if (!allTransfers.length) {
    return <div>No Transactions</div>;
  }

  return (
    <section>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="font-brand text-3xl text-slate-600 dark:text-slate-400">Transaction history</h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-brand">
                <thead className=" bg-gray-50 text-sm font-semibold dark:bg-zinc-900 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-6">
                      Direction
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      User
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left">
                      Date
                    </th>

                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      tax
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900 dark:bg-opacity-80">
                  {allTransfers.map((entry: TransactionCardProps) => (
                    <tr key={entry.timestamp}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 ">
                        <CrossChainIcons
                          chainOne={CHAIN_ICONS[entry.fromToken.chainId]}
                          chainTwo={CHAIN_ICONS[entry.toToken.chainId]}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {ethers.utils.formatUnits(entry.amount, entry.fromToken.decimals).toString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {truncateHash(entry.user ?? "")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {dateToString(entry.timestamp)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <ul>
                          <li>
                            Sending Tx:{" "}
                            <a
                              href={getExplorerLink(entry.fromToken.chainId, "transaction", entry.sendingTx)}
                              className="dark:text-gray-500"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {truncateHash(entry.sendingTx)}
                            </a>
                          </li>

                          <li>
                            Receiving Tx:{" "}
                            <a
                              href={getExplorerLink(entry.toToken.chainId, "transaction", entry.receivingTx ?? "")}
                              className="dark:text-gray-500"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {truncateHash(entry.receivingTx ?? "")}
                            </a>
                          </li>
                          <li>Tax: 0.1%</li>
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;

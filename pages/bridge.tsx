import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import CryptoCard from "../components/cards/CryptoCard";
import Input from "../components/inputs/Input";
import TransactionCard, { mockTransactions } from "../components/cards/TransactionCard";
import ChainSelector from "../components/ChainSelector";
import WordHighlight from "../components/text/WordHighlight";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useGlobalState, setGlobalState } from "../state";
import { networks } from "../config/constants/networks";

import ConfirmBridgeMessage from "../components/bridge/ConfirmBridgeMessage";

const Bridge: NextPage = () => {
  const [locked, setLocked] = useState(false);
  const [locking, setLocking] = useState(false);
  const [returnAmount, setReturnAmount] = useState("0.0");

  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");

  useEffect(() => {
    if (locked) {
      return;
    }

    if (locking) {
      const timer = setTimeout(() => {
        setLocked(true);
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (!locking) {
      setLocked(false);
    }
  }, [locked, locking]);

  // TODO: add debounce
  const handleDrag = (pos: any) => {
    // Has moved more than 500px
    if (pos.offset.x > 260) {
      // Start the locking timers
      setLocking(true);
    }
  };

  const handleDragEnd = () => {
    setLocking(false);
  };

  const calculateReturn = (inputAmount: string) => {
    //.. Do some stuff, this is placeholder logic
    setReturnAmount((parseInt(inputAmount) * 1.1).toString());
  };

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Send funds <WordHighlight content="cross-chain" /> with our bridge.
          </>
        }
        summary="Easily transfer tokens with confidence."
      />

      <Container>
        <div className="relative sm:grid sm:grid-cols-11 sm:items-center">
          <CryptoCard
            title="Bridge from"
            id="bridge_card_from"
            modal={{
              buttonText: networkFrom,
              modalContent: (
                <ChainSelector selectFn={(selectedValue) => setGlobalState("userBridgeFrom", selectedValue)} />
              ),
            }}
          >
            <div className="mx-auto mt-4 max-w-md">
              <label htmlFor="price" className="block text-sm font-medium text-gray-400">
                Token and Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-amber-300 focus:ring-amber-300 sm:text-sm"
                  >
                    <option>BREW</option>
                    <option>GROVE</option>
                    <option>ETH</option>
                  </select>
                </div>

                <Input value="0.00" name="bridge_amount" onBlurFn={calculateReturn} />

                <div className="absolute inset-y-0 right-0 flex items-center">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-amber-300 focus:ring-amber-300 sm:text-sm"
                  >
                    <option>MAX</option>
                    <option>10%</option>
                    <option>25%</option>
                    <option>50%</option>
                    <option>75%</option>
                  </select>
                </div>
              </div>
            </div>
          </CryptoCard>

          <div className="relative z-10 col-span-3 -my-6 flex flex-col items-center justify-between sm:-mx-6 sm:flex-row">
            <div className="absolute left-0 top-0 h-16 w-16 rounded-full border-2 border-dotted border-gray-700 bg-slate-800"></div>

            <motion.div
              drag="x"
              whileDrag={{ scale: 1.2, zIndex: 90 }}
              whileHover={{ scale: 1.2 }}
              dragSnapToOrigin
              onDragEnd={(event, info) => handleDragEnd()}
              onDrag={(event, info) => handleDrag(info)}
              dragConstraints={{ left: 0, right: 200 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
              className="rounded-ful relative h-16 w-16 shrink-0 overflow-hidden bg-cover bg-no-repeat hover:cursor-grab"
              style={{
                backgroundImage: `url('${networks.find((network) => network.name === networkFrom)?.image}')`,
              }}
            ></motion.div>

            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4, duration: 2 }}
              className="absolute -top-16 left-16 w-36 -rotate-12 font-script text-xl"
            >
              <p>Drag to complete the transaction.</p>
            </motion.div> */}

            <div className="-z-10 h-36 w-1 animate-pulse border-r-4 border-dotted border-gray-700 sm:h-1 sm:w-full sm:border-t-4" />

            {networkFrom !== "No network selected" && (
              <div className="slide-x absolute left-14">
                <ChevronDoubleRightIcon className="h-6 w-6 text-gray-500" />
              </div>
            )}

            <div
              className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-dotted border-gray-700 bg-slate-800 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url('${networks.find((network) => network.name === networkTo)?.image}')`,
              }}
            ></div>
          </div>

          <CryptoCard
            title="Bridge to"
            id="bridge_card_to"
            active={locking}
            modal={{
              buttonText: networkTo,
              onClose: () => setLocking(false),
              openModal: locked,
              modalContent: locked ? (
                <ConfirmBridgeMessage />
              ) : (
                <ChainSelector selectFn={(selectedValue) => setGlobalState("userBridgeTo", selectedValue)} />
              ),
            }}
          >
            <div className="mt-8">
              <div className="text-center text-2xl">{returnAmount}</div>
            </div>
          </CryptoCard>
        </div>

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
      </Container>
    </PageWrapper>
  );
};

export default Bridge;

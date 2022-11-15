import React, { useEffect, useState } from "react";
import type { NextPage } from "next";

import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useFromChainId } from "hooks/bridge/useBridgeDirection";
import { getNetworkLabel } from "lib/bridge/helpers";

import PageHeader from "../components/layout/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import CryptoCard from "../components/cards/CryptoCard";
import InputNumber from "../components/inputs/InputNumber";
import ChainSelector from "../components/ChainSelector";
import WordHighlight from "../components/text/WordHighlight";

import { useGlobalState, setGlobalState } from "../state";

import ConfirmBridgeMessage from "../components/bridge/ConfirmBridgeMessage";
import TransactionHistory from "../components/bridge/TransactionHistory";
import BridgeDragTrack from "../components/bridge/BridgeDragTrack";

const Bridge: NextPage = () => {
  const supportedNetworks = useSupportedNetworks()
  const fromChainId = useFromChainId()

  const [locking, setLocking] = useState(false);
  const [returnAmount, setReturnAmount] = useState(0.0);

  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");
  const [amount, setAmount] = useGlobalState("userBridgeAmount");
  const [locked, setLocked] = useGlobalState("userBridgeLocked");

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
  }, [locked, setLocked, locking]);

  const calculateReturn = (inputAmount: number) => {
    setAmount(inputAmount);
    // Do some stuff, this is placeholder logic
    setReturnAmount(inputAmount * 1.1);
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
              buttonText: getNetworkLabel(+networkFrom),
              modalContent: (
                <ChainSelector networks={supportedNetworks} selectFn={(selectedValue) => setGlobalState("userBridgeFrom", selectedValue)} />
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

                <InputNumber value={0.0} name="bridge_amount" onBlurFn={calculateReturn} />

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

          <BridgeDragTrack setLockingFn={setLocking} />

          <CryptoCard
            title="Bridge to"
            id="bridge_card_to"
            active={locking}
            modal={{
              buttonText: getNetworkLabel(+networkTo),
              onClose: () => setLocking(false),
              openModal: locked,
              modalContent: locked ? (
                <ConfirmBridgeMessage />
              ) : (
                <ChainSelector networks={supportedNetworks} selectFn={(selectedValue) => setGlobalState("userBridgeTo", selectedValue)} />
              ),
            }}
          >
            <div className="mt-8">
              <div className="text-center text-2xl text-slate-400">{returnAmount}</div>
            </div>
          </CryptoCard>
        </div>

        <TransactionHistory />
      </Container>
    </PageWrapper>
  );
};

export default Bridge;

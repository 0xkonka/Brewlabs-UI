import { useState, useContext } from "react";
import { useUserSlippageTolerance } from "state/user/hooks";

import SubNav from "./components/nav/SubNav";
import ChainSelect from "./components/ChainSelect";
import SettingModal from "./components/modal/SettingModal";
import Modal from "components/Modal";
import { SwapContext } from "contexts/SwapContext";
import SwapPanel from "./SwapPanel";
import AddLiquidityPanel from "./AddLiquidityPanel";

export default function SwapBoard({ type = "swap", disableChainSelect = false }) {
  const {
    slippageInput,
    autoMode,
    slippage,
    setSlippageInput,
    setAutoMode,
    swapTab,
    openSettingModal,
    setOpenSettingModal,
  }: any = useContext(SwapContext);

  // txn values
  const [, setUserSlippageTolerance] = useUserSlippageTolerance();

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value);
    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(valueAsIntFromRoundedFloat);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`relative mx-auto mb-4 flex w-fit min-w-[90%] max-w-xl flex-col gap-1 rounded-3xl pb-10 pt-4 sm:min-w-[540px] ${
        type === "swap" ? "border-t px-4 dark:border-slate-600" : ""
      } dark:bg-zinc-900 sm:px-10 md:mx-0`}
    >
      <SubNav openSettingModal={() => setOpenSettingModal(true)} />

      {!disableChainSelect && <ChainSelect id="chain-select" />}

      {swapTab === 0 ? <SwapPanel /> : swapTab === 1 ? <AddLiquidityPanel /> : null}

      {openSettingModal && (
        <Modal
          open={openSettingModal}
          onClose={() => {
            setOpenSettingModal(false);
          }}
        >
          <SettingModal
            autoMode={autoMode}
            setAutoMode={setAutoMode}
            slippage={slippage}
            slippageInput={slippageInput}
            parseCustomSlippage={parseCustomSlippage}
          />
        </Modal>
      )}
    </div>
  );
}

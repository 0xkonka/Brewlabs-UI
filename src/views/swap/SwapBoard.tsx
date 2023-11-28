import { useContext } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useUserSlippageTolerance } from "state/user/hooks";

import { SwapContext } from "contexts/SwapContext";
import { NFTSVG } from "@components/dashboard/assets/svgs";
import Modal from "components/Modal";
import Security from "@components/SwapComponents/Security";
import SlippageText from "@components/SwapComponents/SlippageText";

import ChainSelect from "./components/ChainSelect";
import SettingModal from "./components/modal/SettingModal";
import SubNav from "./components/nav/SubNav";

import AddLiquidityPanel from "./AddLiquidityPanel";
import SwapPanel from "./SwapPanel";
import SwapRewards from "./components/SwapRewards";

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
    addLiquidityStep,
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
      className={`relative mx-auto mb-4 flex w-fit min-w-full flex-col gap-1 rounded-3xl pb-10 pt-4 sm:min-w-[540px] ${
        type === "swap" ? "border-t px-3 dark:border-slate-600" : ""
      } dark:bg-zinc-900 sm:px-10 md:mx-0`}
    >
      <div
        className="tooltip absolute right-14 top-6 scale-75 cursor-pointer text-[rgb(75,85,99)]"
        data-tip="No Brewlabs NFT found."
      >
        {NFTSVG}
      </div>
      <SubNav openSettingModal={() => setOpenSettingModal(true)} />

      <div className="flex items-center justify-between">
        {swapTab !== 1 ? <Security size="lg" /> : <div />}
        <SlippageText className="!text-xs" />
      </div>

      {!disableChainSelect && <ChainSelect id="chain-select" />}

      {/* <SwapSelection swapType={swapType} setSwapType={setSwapType} /> */}

      <div className="flex flex-col">
        {swapTab === 0 ? (
          <SwapPanel />
        ) : swapTab === 1 ? (
          addLiquidityStep === "ViewHarvestFees" ? (
            <SwapRewards />
          ) : (
            <AddLiquidityPanel />
          )
        ) : (
          ""
        )}
      </div>

      {/* {swapType === 1 && currencies[Field.INPUT] && currencies[Field.OUTPUT] ? (
        <TradingViewChart
          currency={{ tokenAddresses: [currencies[Field.INPUT].address, currencies[Field.OUTPUT].address], chainId }}
        />
      ) : (
        ""
      )} */}

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

      <ReactTooltip anchorId={"nfticon"} place="top" content="No Brewlabs NFT found." />
    </div>
  );
}

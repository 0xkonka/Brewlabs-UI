import { useContext, useState } from "react";
import { NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";

import { SwapContext } from "contexts/SwapContext";
import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { InfoSVG } from "components/dashboard/assets/svgs";
import { useLPTokens, SYMBOL_VS_SWAP_TABLE } from "hooks/constructor/useLPTokens";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getExplorerLink, getNativeSybmol } from "lib/bridge/helpers";
import { getLpManagerAddress } from "utils/addressHelpers";

import Modal from "components/Modal";
import SettingModal from "views/swap/components/modal/SettingModal";

import BasePanel from "./BasePanel";
import RemoveLiquidityPanel from "./RemoveLiquidityPanel";
import AddLiquidityPanel from "./AddLiquidityPanel";
import { useUserSlippageTolerance } from "state/user/hooks";

export default function Constructor() {
  const { chainId } = useActiveChainId();

  const [curAction, setCurAction] = useState("default");
  const [selectedLP, setSelectedLP] = useState(0);
  const [showCount, setShowCount] = useState(3);

  const { ethLPTokens, bscLPTokens, fetchLPTokens }: any = useLPTokens();
  const {
    slippageInput,
    autoMode,
    slippage,
    setSlippageInput,
    setAutoMode,
    openSettingModal,
    setOpenSettingModal,
  }: any = useContext(SwapContext);
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

  const lpTokens = [...(ethLPTokens ?? []), ...(bscLPTokens ?? [])];
  const sortedTokens =
    lpTokens && lpTokens.sort((a, b) => b.balance * b.price - a.balance * a.price).slice(0, showCount);
  const isLoading = !(lpTokens.length || (ethLPTokens !== null && bscLPTokens !== null));

  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Manage your liquidity with the <WordHighlight content="Brewlabs" /> Constructor.
            <div className="whitespace-wrap mt-5 text-xl font-normal sm:whitespace-nowrap">
              Add or remove liquidity from a number of routers free from any token tax fees.
            </div>
          </>
        }
      />
      <Container className="overflow-hidden font-brand">
        <div className="relative mx-auto mb-4 flex w-fit min-w-[90%] max-w-[660px] flex-col gap-1 rounded-3xl border-t px-4 pb-10 pt-4 dark:border-slate-600 dark:bg-zinc-900 sm:min-w-[540px] sm:px-10 md:mx-0">
          <div className="mt-2 text-2xl text-white">Liquidity Constructor</div>
          <div className="absolute right-7 top-6" onClick={() => setOpenSettingModal(true)}>
            <Cog8ToothIcon className="h-6 w-6 cursor-pointer hover:animate-spin dark:text-primary" />
          </div>
          <a
            className="mt-9 flex cursor-pointer items-center justify-center rounded-[30px] border border-[#FFFFFF80] text-[#FFFFFFBF] transition hover:text-white"
            target="_blank"
            href={getExplorerLink(chainId, "address", getLpManagerAddress(chainId))}
            rel="noreferrer"
          >
            <div className="flex w-full items-start justify-between p-[16px_12px_16px_12px] sm:p-[16px_40px_16px_40px]">
              <div className="mt-2 scale-150 text-white">{InfoSVG}</div>
              <div className="ml-4 flex-1 text-sm xsm:ml-6">
                Important message to project owners: To ensure tax-free liquidity token creation for users of this
                constructor, please whitelist the following address
              </div>
            </div>
          </a>
          {curAction === "default" ? (
            <BasePanel
              setCurAction={setCurAction}
              setSelectedLP={setSelectedLP}
              sortedTokens={sortedTokens}
              lpTokens={lpTokens}
              showCount={showCount}
              setShowCount={setShowCount}
              isLoading={isLoading}
            />
          ) : curAction === "Remove" ? (
            <RemoveLiquidityPanel
              onBack={() => setCurAction("default")}
              fetchLPTokens={fetchLPTokens}
              selectedChainId={sortedTokens[selectedLP]?.chainId ?? chainId}
              selecedDexId={SYMBOL_VS_SWAP_TABLE[sortedTokens[selectedLP]?.symbol]}
              currencyA={
                sortedTokens[selectedLP]?.token0.symbol === getNativeSybmol(sortedTokens[selectedLP]?.chainId)||
                sortedTokens[selectedLP]?.token0.symbol === WNATIVE[sortedTokens[selectedLP]?.chainId].symbol
                  ? NATIVE_CURRENCIES[sortedTokens[selectedLP]?.chainId]
                  : new Token(
                      sortedTokens[selectedLP]?.chainId,
                      sortedTokens[selectedLP]?.token0.address,
                      +sortedTokens[selectedLP]?.token0.decimals,
                      sortedTokens[selectedLP]?.token0.symbol
                    )
              }
              currencyB={
                sortedTokens[selectedLP]?.token1.symbol === getNativeSybmol(sortedTokens[selectedLP]?.chainId) ||
                sortedTokens[selectedLP]?.token1.symbol === WNATIVE[sortedTokens[selectedLP]?.chainId].symbol
                  ? NATIVE_CURRENCIES[sortedTokens[selectedLP]?.chainId]
                  : new Token(
                      sortedTokens[selectedLP]?.chainId,
                      sortedTokens[selectedLP]?.token1.address,
                      +sortedTokens[selectedLP]?.token1.decimals,
                      sortedTokens[selectedLP]?.token1.symbol
                    )
              }
              lpPrice={sortedTokens[selectedLP].price}
            />
          ) : curAction === "addLiquidity" ? (
            <AddLiquidityPanel
              onBack={() => setCurAction("default")}
              fetchLPTokens={fetchLPTokens}
              selectedChainId={chainId}
            />
          ) : (
            ""
          )}
        </div>
      </Container>

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
    </PageWrapper>
  );
}

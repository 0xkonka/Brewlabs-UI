import { TransactionResponse } from "@ethersproject/providers";

import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { InfoSVG } from "components/dashboard/assets/svgs";
import OutlinedButton from "views/swap/components/button/OutlinedButton";
import { useState } from "react";
import BasePanel from "./BasePanel";
import { useLPTokens } from "hooks/constructor/useLPTokens";
import RemoveLiquidityPanel from "./RemoveLiquidityPanel";
import AddLiquidityPanel from "./AddLiquidityPanel";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getLpManagerAddress } from "utils/addressHelpers";

export default function Constructor() {
  const [curAction, setCurAction] = useState("default");
  const [selectedLP, setSelectedLP] = useState(0);
  const [showCount, setShowCount] = useState(3);

  const { ethLPTokens, bscLPTokens }: any = useLPTokens();

  const lpTokens = [...(ethLPTokens ?? []), ...(bscLPTokens ?? [])];
  const sortedTokens =
    lpTokens && lpTokens.sort((a, b) => b.balance * b.price - a.balance * a.price).slice(0, showCount);
  const isLoading = !(lpTokens.length || (ethLPTokens !== null && bscLPTokens !== null));
  const { chainId } = useActiveChainId();
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Liquidity <WordHighlight content="best" /> Constructor.
          </>
        }
      />
      <Container className="font-Roboto overflow-hidden">
        <div className="relative mx-auto mb-4 flex w-fit min-w-[90%] max-w-[660px] flex-col gap-1 rounded-3xl border-t px-4 pb-10 pt-4 dark:border-slate-600 dark:bg-zinc-900 sm:min-w-[540px] sm:px-10 md:mx-0">
          <div className="mt-2 text-2xl text-white">Liquidity Constructor</div>
          <a
            className="mt-9 flex cursor-pointer items-center justify-center rounded-[30px] border border-[#FFFFFF80] text-[#FFFFFFBF] transition hover:text-white"
            target="_blank"
            href={`https://${chainId === 1 ? "etherscan.io" : "bscscan.com"}/address/${getLpManagerAddress(chainId)}`}
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
            <RemoveLiquidityPanel selectedLP={sortedTokens[selectedLP]} setCurAction={setCurAction} />
          ) : curAction === "addLiquidity" ? (
            <AddLiquidityPanel setCurAction={setCurAction} />
          ) : (
            ""
          )}
        </div>
      </Container>
    </PageWrapper>
  );
}

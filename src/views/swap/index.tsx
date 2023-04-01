import { TransactionResponse } from "@ethersproject/providers";

import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { useContext } from "react";
import { SwapContext } from "contexts/SwapContext";
import SwapPanel from "./SwapPanel";
import AddLiquidityPanel from "./AddLiquidityPanel";
import SwapBoard from "./SwapBoard";

export default function Swap() {
  const { swapTab }: any = useContext(SwapContext);
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Exchange tokens at the <WordHighlight content="best" /> rate on the market.
          </>
        }
      />
      <Container>
        <SwapBoard />
      </Container>
    </PageWrapper>
  );
}

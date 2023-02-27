import { TransactionResponse } from "@ethersproject/providers";

import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import SwapPanel from "./SwapPanel";

export default function Swap() {
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
        <SwapPanel />
      </Container>
    </PageWrapper>
  );
}

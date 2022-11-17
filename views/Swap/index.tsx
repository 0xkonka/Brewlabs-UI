import PageHeader from "../../components/layout/PageHeader";
import Container from "../../components/layout/Container";
import PageWrapper from "../../components/layout/PageWrapper";
import WordHighlight from "../../components/text/WordHighlight";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import SubNav from "./components/SubNav";
import ChainSelect from "./components/ChainSelect";
import History from "./components/History";
import SwitchIconButton from "./components/SwitchIconButton";

export default function Swap() {
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Exchange Tokens at the <WordHighlight content="best" /> rate on the market.
          </>
        }
        summary="Exchange Tokens at the best rate on the market."
      />

      <Container>
        <div className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="grid auto-rows-auto" style={{ gap: "4px" }}>
            <SubNav />
            <ChainSelect />
            <CurrencyInputPanel label="Sell" />
            <SwitchIconButton />
            <CurrencyInputPanel label="Buy" />
            <History />
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}

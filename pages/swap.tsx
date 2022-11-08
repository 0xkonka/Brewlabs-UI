import type { NextPage } from "next";
import PageHeader from "../components/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import WordHighlight from "../components/text/WordHighlight";

const Swap: NextPage = () => {
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Discover the power of <WordHighlight content="farming" /> staked
            liquidity.
          </>
        }
        summary="Stake liquidity tokens in our Brewlabs farming platform for passive income."
      />

      <Container>
        <div className="flex h-80 w-full items-center justify-center rounded-lg border-4 border-dashed border-gray-400">
          <h2 className="font-brand text-xl">Swap go here</h2>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Swap;

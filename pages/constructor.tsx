import type { NextPage } from "next";
import Head from "next/head";
import PageHeader from "../components/layout/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import WordHighlight from "../components/text/WordHighlight";

const Constructor: NextPage = () => {
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Discover the power of <WordHighlight content="farming" /> staked liquidity.
          </>
        }
        summary="Stake liquidity tokens in our Brewlabs farming platform for passive income."
      />

      <Container>
        <div className="flex h-80 w-full items-center justify-center rounded-lg border-4 border-dashed border-gray-400">
          <h2 className="font-brand text-xl">Constructor go here</h2>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Constructor;

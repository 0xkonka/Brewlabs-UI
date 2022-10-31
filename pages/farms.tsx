import type { NextPage } from "next";
import Head from "next/head";
import PageHeader from "../components/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import WordHighlight from "../components/text/WordHighlight";

const Farms: NextPage = () => {
  return (
    <PageWrapper>
      <Head>
        <title>Brewlabs - Farms</title>
        <meta
          name="description"
          content="Stake your tokens in a range of projects to earn passive income and reflections."
        />
      </Head>

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
        <div className="-mt-8 flex h-80 w-full items-center justify-center rounded-lg border bg-zinc-900 shadow-lg dark:border-gray-900">
          <h3 className="font-brand text-xl">Farms go here</h3>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Farms;

import type { NextPage } from "next";
import Head from "next/head";
import PageHeader from "../components/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";

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

      <PageHeader />

      <Container>
        <div className="h-80 w-full border -mt-8 dark:border-gray-900 rounded-lg flex justify-center items-center bg-zinc-900 shadow-lg">
          <h3 className="font-brand text-xl">Farms go here</h3>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Farms;

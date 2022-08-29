import type { NextPage } from "next";
import Head from "next/head";
import Container from "../components/layout/Container";

const Swap: NextPage = () => {
  return (
    <>
      <Head>
        <title>Brewlabs - Swap</title>
        <meta
          name="description"
          content="Stake your tokens in a range of projects to earn passive income and reflections."
        />
      </Head>

      <Container>
        <div className="h-80 w-full border-4 border-gray-400 border-dashed rounded-lg flex justify-center items-center">
          <h2 className="font-brand text-xl">Swap go here</h2>
        </div>
      </Container>
    </>
  );
};

export default Swap;

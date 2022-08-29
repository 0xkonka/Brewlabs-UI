import type { NextPage } from "next";
import Head from "next/head";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import PageHeader from "../components/PageHeader";
import Table from "../components/Table";

const Pools: NextPage = () => {
  return (
    <PageWrapper>
      <Head>
        <title>Brewlabs - Pools</title>
        <meta
          name="description"
          content="Stake your tokens in a range of projects to earn passive income and reflections."
        />
      </Head>

      <PageHeader />

      <Container>
        <div className="flex justify-end">
          <div className="mt-4 sm:mt-0 sm:ml-16">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Request a pool
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Pools;

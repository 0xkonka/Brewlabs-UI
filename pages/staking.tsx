import type { NextPage } from "next";
import Head from "next/head";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import PageHeader from "../components/PageHeader";
import WordHighlight from "../components/text/WordHighlight";
import Filters from "../components/Filters";
import ExpandableRow from "../components/ExpandableRow";

const mockPoolData = [
  {
    id: "123",
    name: "Crazy crypto",
    stakeCoin: "BTC",
    earnCoin: "BTC",
    lockPeriodDays: 60,
    reflections: true,
    aprPercentage: 30,
    endsInPercentage: 67,
  },
  {
    id: "124",
    name: "Hot Potato",
    stakeCoin: "BTC",
    earnCoin: "BTC",
    lockPeriodDays: 60,
    reflections: true,
    aprPercentage: 30,
    endsInPercentage: 45,
  },
  {
    id: "125",
    name: "Whiteclaw",
    stakeCoin: "BTC",
    earnCoin: "BTC",
    lockPeriodDays: 60,
    reflections: true,
    aprPercentage: 30,
    endsInPercentage: 35,
  },
  {
    id: "12356",
    name: "Crazy crypto",
    stakeCoin: "BTC",
    earnCoin: "BTC",
    lockPeriodDays: 60,
    reflections: true,
    aprPercentage: 30,
    endsInPercentage: 15,
  },
  {
    id: "12334",
    name: "Hot Potato",
    stakeCoin: "BTC",
    earnCoin: "BTC",
    lockPeriodDays: 60,
    reflections: true,
    aprPercentage: 30,
    endsInPercentage: 80,
  },
  {
    id: "155",
    name: "Whiteclaw",
    stakeCoin: "BTC",
    earnCoin: "BTC",
    lockPeriodDays: 60,
    reflections: true,
    aprPercentage: 30,
    endsInPercentage: 45,
  },
];

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

      <PageHeader
        title={
          <>
            Staking <WordHighlight content="Pools" />
          </>
        }
        summary="Stake your tokens in a range of projects to passive income and reflections."
      />

      <Container>
        <Filters />

        {/* 
        <div className="flex justify-end">
          <div className="mt-4 sm:mt-0 sm:ml-16">
           
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Request a pool
            </button>
          </div>
        </div> */}

        {mockPoolData.map((itemData) => (
          <ExpandableRow key={itemData.id} data={itemData} />
        ))}
      </Container>
    </PageWrapper>
  );
};

export default Pools;

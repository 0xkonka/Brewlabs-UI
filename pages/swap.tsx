import type { NextPage } from "next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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
            Discover the power of <WordHighlight content="farming" /> staked liquidity.
          </>
        }
        summary="Stake liquidity tokens in our Brewlabs farming platform for passive income."
      />

      <Container>
        {/* <div className="flex items-center justify-center w-full border-4 border-gray-400 border-dashed rounded-lg h-80">
          <h2 className="text-xl font-brand">Swap go here</h2>
        </div> */}
        <div className="mx-auto flex max-w-[500px] justify-between rounded-lg p-2 dark:bg-zinc-900 dark:bg-opacity-60">
          {/* <img src="/images/networks/eth.svg" alt=""></img> */}
          <p className="font-[Questrial]">Ethereum</p>
          <ChevronDownIcon className="h-6 w-6 dark:text-brand" />
        </div>
        <div className="mx-auto mt-1 max-w-[500px] rounded-lg px-9 pt-1 dark:bg-zinc-900 dark:bg-opacity-60">
          <p className="font-[Questrial]">Sell</p>
          <div className="flex justify-between">
            <div>
              <p className="font-[Questrial] text-4xl">0.00</p>
              <p className="font-[Questrial] text-xs text-white/50">0.00 USD</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="font-[Questrial] text-2xl">ETH</p>
                <ChevronDownIcon className="h-6 w-6 dark:text-brand" />
              </div>
              <p className="font-[Questrial] text-xs text-white/50">24.21 ETH</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-[500px] rounded-lg px-9 pt-1 dark:bg-zinc-900 dark:bg-opacity-60">
          <p className="font-[Questrial]">Buy</p>
          <div className="flex justify-between">
            <div>
              <p className="font-[Questrial] text-4xl">0.00</p>
              <p className="font-[Questrial] text-xs text-white/50">0.00 USD</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="font-[Questrial] text-2xl">ETH</p>
                <ChevronDownIcon className="h-6 w-6 dark:text-brand" />
              </div>
              <p className="font-[Questrial] text-xs text-white/50">24.21 ETH</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-2 flex max-w-[500px] items-center justify-between rounded-lg p-1 dark:bg-zinc-900 dark:bg-opacity-60">
          <p className="font-[Questrial]">Show History</p>
          <ChevronDownIcon className="h-6 w-6 dark:text-brand" />
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Swap;

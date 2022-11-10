import { ChevronDownIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/layout/PageHeader";
import Container from "../../components/layout/Container";
import PageWrapper from "../../components/layout/PageWrapper";
import WordHighlight from "../../components/text/WordHighlight";
import CardSwap from "./components/CardSwap";

export default function Swap() {
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
          <div className="mx-auto max-w-[500px]">
            <div className="grid auto-rows-auto gap-1">
              <div className="flex justify-between">
                <CardSwap>
                  BrewSwap
                </CardSwap>
                <CardSwap>
                  Add Liquidity
                </CardSwap>
                <CardSwap>
                  Convert
                </CardSwap>
                <CardSwap>
                  Settings
                </CardSwap>
              </div>
              <CardSwap>
                <div className="flex justify-between">
                  <p className="font-[Questrial]">Ethereum</p>
                  <ChevronDownIcon className="h-6 w-6 dark:text-brand" />
                </div>
              </CardSwap>
              <CardSwap>
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
              </CardSwap>
              <CardSwap>
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
              </CardSwap>
              <CardSwap>
                <div className="flex justify-between">
                  <p className="font-[Questrial]">Show History</p>
                  <ChevronDownIcon className="h-6 w-6 dark:text-brand" />
                </div>
              </CardSwap>
            </div>
          </div>
        </Container>
    </PageWrapper>
  )
}
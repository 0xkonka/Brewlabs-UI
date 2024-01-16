import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import SwapBoard from "./SwapBoard";
import { DocSVG } from "@components/dashboard/assets/svgs";

export default function Swap() {
  return (
    <PageWrapper>
      <section>
        <Container className="pb-16 pt-20">
          <header className="font-brand sm:pr-0">
            <h1 className="text-3xl text-slate-700 dark:text-slate-400 sm:text-4xl">
              <div className="text-[40px]">
                <>
                  Exchange tokens at the <WordHighlight content="best" /> rate on the market.
                </>
                <a
                  className="primary-shadow mt-2 flex w-fit items-center rounded bg-[#FFFFFF1A] p-2 font-roboto text-xs font-bold !text-primary transition hover:scale-[1.1]"
                  href="https://brewlabs.gitbook.io/welcome-to-brewlabs/brewlabs-defi-products/brewlabs-2023/testing-brewswap-router"
                  target="_blank"
                >
                  <div>LEARN MORE</div>
                  <div className="ml-1 [&>svg]:!h-2.5 [&>svg]:!w-2.5">{DocSVG}</div>
                </a>
              </div>
            </h1>
          </header>
        </Container>
      </section>

      <Container>
        <div className="-mt-6 mb-10 font-brand">
          <div className="text-lg leading-[1.2] text-primary">{"Exchange tokens at the best rate on the market."}</div>
          <div className="mt-1.5 max-w-[1000px] text-sm leading-[1.2]">
            Brewlabs BrewSwap is an aggregated decentralised exchange (aDEX) that seeks the most affordable swap route
            for the user. The BrewSwap aggregator feature fetches price’s for your swap through a number of relay
            contracts to obtain the ideal swap from the industries largest liquidity pools. The combined decentralised
            exchange features allow for unique liquidity pool creation and token tax management, instant fee issuance to
            liquidity providers and innovate fee reduction benefits for Brewlabs NFT holders.
          </div>
        </div>
        <SwapBoard />
      </Container>
    </PageWrapper>
  );
}

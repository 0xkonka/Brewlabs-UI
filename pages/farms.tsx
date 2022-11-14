import type { NextPage } from "next";
import PageHeader from "../components/layout/PageHeader";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import WordHighlight from "../components/text/WordHighlight";
import {priceHelperLps} from "config/constants/farms";

const Farms: NextPage = () => {
  console.log(priceHelperLps)
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
        <div className="-mt-8 flex h-80 w-full items-center justify-center rounded-lg border bg-zinc-900 shadow-lg dark:border-gray-900">
          <h3 className="font-brand text-xl">Farms go here</h3>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default Farms;

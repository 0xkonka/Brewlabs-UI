import { DocumentTextIcon } from "@heroicons/react/24/outline";

import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";

import NFTActions from "./NFTActions";
import NFTList from "./NFTList";

const NFT = () => {
  return (
    <PageWrapper>
      <PageHeader
        title="Mint, upgrade, benefit and earn"
        tagline="Brewlabs NFT's"
        summary={
          <>
            Brewlabs is responsible for number of products and utilities deployed across the decentralised finance
            industry. The Brewlabs NFT collection allows users to mint a Brewlabs NFT at anytime to gain access to a
            number of benefits within the Brewlabs ecosystem including fee discounts, premium features, whitelist access
            and more. Mint an NFT below and unlock the benefits of the Brewlabs NFT. Users can also stake their rare,
            epic and legendary NFT’s to earn rewards.
          </>
        }
      >
        <a
          className="btn mt-4"
          target="_blank"
          href="https://brewlabs.gitbook.io/welcome-to-brewlabs/brewlabs-defi-products/brewlabs-2023/live-brewlabs-nft"
        >
          <DocumentTextIcon className="h-auto w-6" />
          Learn more
        </a>
      </PageHeader>

      <Container className="font-brand xl:mt-32">
        <NFTActions />

        <NFTList />
      </Container>
    </PageWrapper>
  );
};

export default NFT;

import type { NextPage } from "next";
import CardVideo from "../components/cards/CardVideo";
import Footer from "../components/layout/Footer";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import PageHero from "../components/layout/PageHero";

const Home: NextPage = () => (
  <PageWrapper>
    <PageHero pageTitle="Ready to earn" pageIntro="Brewlabs Earn is where you can build your future" />

    <main className="mt-16 min-h-screen">
      <section>
        <Container className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-y-10 lg:grid-cols-3">
          <CardVideo cardId="1" youtubeId="ZJgpQ9EpVvo" />
          <CardVideo cardId="2" youtubeId="ZJgpQ9EpVvo" />
          <CardVideo cardId="3" youtubeId="ZJgpQ9EpVvo" />
        </Container>
      </section>
    </main>

    <Footer />
  </PageWrapper>
);

export default Home;

import type { NextPage } from "next";

import Footer from "@components/layout/Footer";
import PageWrapper from "@components/layout/PageWrapper";
import PageHero from "@components/layout/PageHero";

import FeaturePlug from "@components/homex/FeaturePlug";
import VideoSection from "@components/homex/VideoSection";
import FindProject from "@components/homex/FindProject";

const Home: NextPage = () => (
  <PageWrapper>
    <PageHero />

    <main className="min-h-screen">
      <FindProject />
      <VideoSection />
      <FeaturePlug />
    </main>

    <Footer />
  </PageWrapper>
);

export default Home;

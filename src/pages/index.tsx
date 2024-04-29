import type { NextPage } from "next";

import Footer from "@components/layout/Footer";
import PageWrapper from "@components/layout/PageWrapper";
import PageHero from "@components/layout/PageHero";

import FeaturePlug from "@components/home/FeaturePlug";
import VideoSection from "@components/home/VideoSection";
import FindProject from "@components/home/FindProject";

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

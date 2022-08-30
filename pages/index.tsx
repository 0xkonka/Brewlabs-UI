import type { NextPage } from "next";
import Head from "next/head";
import CardVideo from "../components/cards/CardVideo";

import Footer from "../components/Footer";
import Container from "../components/layout/Container";
import PageWrapper from "../components/layout/PageWrapper";
import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => (
  <PageWrapper>
    <Head>
      <title>Brewlabs - Earn</title>
      <meta name="description" content="Earn with Brewlabs" />
    </Head>

    {/* <Navbar /> */}

    <PageHero
      pageTitle="Welcome to Brewlabs"
      pageIntro="Make use of the Brewlabs constructor to create tax free liquidity tokens."
    />

    <main className="min-h-screen mt-16">
      <section>
        <Container className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-y-10 lg:grid-cols-3">
          <CardVideo cardId="1" />
          <CardVideo cardId="2" />
          <CardVideo cardId="3" />
        </Container>
      </section>
    </main>

    <Footer />
  </PageWrapper>
);

export default Home;

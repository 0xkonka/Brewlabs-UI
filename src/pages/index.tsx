import type { NextPage } from "next";
import CardVideo from "@components/cards/CardVideo";
import Footer from "@components/layout/Footer";
import Container from "@components/layout/Container";
import PageWrapper from "@components/layout/PageWrapper";
import PageHero from "@components/layout/PageHero";
import FeaturePlug from "@components/FeaturePlug";
import LogoIcon from "@components/LogoIcon";
import { ClockIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => (
  <PageWrapper>
    <PageHero />

    <main className="mt-16 min-h-screen">
      <section className="bg-gradient-to-b from-slate-800 to-zinc-900 pt-8 pb-16">
        <Container className="">
          <div className="grid grid-cols-4 gap-16">
            <div className="col-span-2 mr-24">
              <h2 className="font-brand text-lg font-semibold leading-8 tracking-widest text-dark dark:text-brand">
                Smart tech for smart people
              </h2>
              <p className="mt-2 font-brand text-4xl font-bold tracking-widest text-gray-900">Investment suite</p>

              <p className="mt-2 dark:text-slate-400">
                All of our staking and farming contracts are audited by a third party vendor, Certik. Safety and
                security are our priority.
              </p>

              <p className="mt-2 dark:text-slate-400">
                Staking is a great way to earn passive income or if you are the contract owner it's a great way to
                reward your community.
              </p>

              <button className="btn-primary btn-sm btn mt-4">
                <img src="./images/certik-logo.svg" alt="certik logo" className="mr-4 h-6 w-6" /> View our Certik audit
              </button>
            </div>
            <div className="col-span-2 max-w-md">
              <div className="w-100 flex h-64 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900">
                <div className="">
                  <LogoIcon classNames="w-10 text-dark dark:text-brand" />
                  <h5 className="text-2xl">BREWLABS STAKING</h5>
                  <div className="flex items-center">
                    <PlayCircleIcon className="mr-1 h-6 w-6" />
                    <p className="text-sm dark:text-gray-500">Find out how staking works</p>
                    {/* <span className="underline">Watch the video</span> */}
                  </div>
                </div>
              </div>

              {/* <CardVideo cardId="1" youtubeId="ZJgpQ9EpVvo" /> */}
            </div>
          </div>
        </Container>
      </section>

      <FeaturePlug />
    </main>

    <Footer />
  </PageWrapper>
);

export default Home;

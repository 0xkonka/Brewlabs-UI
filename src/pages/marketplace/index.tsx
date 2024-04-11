import PageWrapper from "@components/layout/PageWrapper";
import PageHero from "@components/layout/PageHero";

import Container from "@components/layout/Container";
import BondTable from "@components/marketplace/bond-table";

// Better mock data and UI
// Images, colours

// modal opening

// Data fetching

// column sorting - type at least

export default function Page() {
  return (
    <PageWrapper>
      <section className="relative flex flex-col justify-center overflow-hidden pt-32 md:justify-end lg:pt-32">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none xl:col-span-6">
              <header className="mb-4 mt-4 font-brand sm:mt-5 lg:mt-6">
                <h1 className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-4xl text-transparent lg:text-5xl">
                  Get ready for the next generation in blockchain utilities
                </h1>
              </header>

              <p className="mb-12 max-w-sm text-base text-dark dark:text-gray-400 sm:mb-4">
                Brewlabs Earn is where you can build your future. We have a unique set of tools and utilities to build
                your portfolio.
              </p>

              <div className="mt-4 flex w-full flex-col sm:w-[400px]">
                <div className="flex flex-col flex-wrap xmd:flex-row"></div>
              </div>
            </div>

            <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6"></div>
          </div>
        </Container>
      </section>

      <main className="min-h-screen pt-8">
        <Container>
          <BondTable />
        </Container>
      </main>
    </PageWrapper>
  );
}

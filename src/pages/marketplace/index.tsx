import Link from "next/link";
import { ZapIcon } from "lucide-react";
import PageWrapper from "@components/layout/PageWrapper";

import { Button } from "@components/ui/button";

import Container from "@components/layout/Container";
import BondTable from "@components/marketplace/bond-table";
import BondInvest from "@components/marketplace/bond-invest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageWrapper>
        <Button
          asChild
          variant="outline"
          className="absolute right-4 top-4 z-10 animate-in slide-in-from-right-60 fill-mode-both"
        >
          <Link href="/marketplace/create-bond">
            Create a new bond <ZapIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
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

        <BondInvest />
      </PageWrapper>
    </QueryClientProvider>
  );
}

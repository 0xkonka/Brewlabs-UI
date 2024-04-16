import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@components/ui/button";

import Container from "@components/layout/Container";
import PageHeader from "@components/layout/PageHeader";
import PageWrapper from "@components/layout/PageWrapper";
import BondCreate from "@components/marketplace/bond-create";

export default function Page() {
  return (
    <PageWrapper>
      <PageHeader title="Create a new bond" tagline="Are you ready for this?">
        <Button asChild variant="outline" className="mt-4 animate-in slide-in-from-right-60 fill-mode-both">
          <Link href="/marketplace">
            <ChevronLeftIcon className="w-4" /> Go to bond marketplace
          </Link>
        </Button>
      </PageHeader>
      <main className="min-h-screen pt-8 animate-in slide-in-from-right-60 fill-mode-both">
        <Container className="pb-4 font-brand">
          <BondCreate />
        </Container>
      </main>
    </PageWrapper>
  );
}

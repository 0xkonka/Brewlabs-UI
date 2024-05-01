import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import PoolDeployer from "components/productDeployer/PoolDeployer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@components/ui/hover-card";

export default function DeployToken() {
  return (
    <PageWrapper>
      <PageHeader
        title="Deploy a new staking pool"
        summary={
          <>
            Welcome to the Brewlabs product deployer wizard.<br></br> Using this wizard will allow you to deploy a range
            of Brewlabs products.
          </>
        }
      >
        <div className="mt-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <img src="/images/certik-logo-white.svg" alt="Certik logo" className="h-auto w-24" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">All our deploy contracts are CertiK verified</h4>
                  <p className="my-6 text-sm text-gray-400">
                    We take security seriously, all our deploy contracts are verified by CertiK. This means you can be
                    confident that the contract you are deploying is secure and safe.
                  </p>
                  <div className="flex items-center pt-2">
                    <a href="#" target="_blank" className="text-xs text-muted-foreground">
                      View audit here
                    </a>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </PageHeader>

      <Container className="animate__animated animate__fadeIn animate__faster pb-4 font-brand">
        <PoolDeployer />
      </Container>
    </PageWrapper>
  );
}

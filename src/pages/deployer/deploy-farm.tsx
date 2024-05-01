import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import FarmDeployer from "components/productDeployer/FarmDeployer";

export default function DeployToken() {
  return (
    <PageWrapper>
      <PageHeader
        title="Deploy a new farm"
        summary={
          <>
            Welcome to the Brewlabs product deployer wizard.<br></br> Using this wizard will allow you to deploy a range
            of Brewlabs products.
          </>
        }
      >
        <p className="mt-4 text-xs">
          *Staking pools, Yield farms and Indexes will also deploy to the Brewlabs directory, you can find the latest
          pools easily be filtering with the “New” category.
        </p>
      </PageHeader>

      <Container className="animate__animated animate__fadeIn animate__faster pb-4 font-brand">
        <FarmDeployer />
      </Container>
    </PageWrapper>
  );
}

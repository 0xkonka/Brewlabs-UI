import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import PoolDeployer from "components/productDeployer/PoolDeployer";

export default function DeployToken() {
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            <WordHighlight content="Deploy" /> a new staking pool
          </>
        }
        summary={
          <>
            Welcome to the Brewlabs product deployer wizard.<br></br> Using this wizard will allow you to deploy a range
            of Brewlabs products.
          </>
        }
      ></PageHeader>

      <Container className="animate__animated animate__fadeIn animate__faster pb-4 font-brand">
        <PoolDeployer />
      </Container>
    </PageWrapper>
  );
}

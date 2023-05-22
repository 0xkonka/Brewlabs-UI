import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import Header1 from "./components/header1";
import Header2 from "./components/header2";
import ChartContent from "./components/content";

export default function Chart() {

  return (
    <PageWrapper>
      <PageHeader
        fullWidth={true}
        title={
          <Header1 />
        }
        children={<Header2 />}
      />
      <ChartContent />
    </PageWrapper>
  );
}



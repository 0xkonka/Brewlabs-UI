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
      />
      <div className="flex flex-col mt-[-57px] pl-[2rem] pr-[2rem] gap-[21px] max-[480px]:pl-[1rem] max-[480px]:pr-[1rem] ">
        <Header2/>
        <ChartContent />
      </div>

    </PageWrapper>
  );
}



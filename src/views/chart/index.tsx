import PageHeader from "components/layout/PageHeader";
import PageWrapper from "components/layout/PageWrapper";
import Header1 from "./components/header1";
import Header2 from "./components/header2";
import ChartContent from "./components/content";
import SearchModal from "./components/modal";

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
      <SearchModal />
    </PageWrapper>
  );
}
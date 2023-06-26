import PageHeader from "components/layout/PageHeader";
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import WordHighlight from "components/text/WordHighlight";
import { useState } from "react";
import PairList from "./PairList";
import StyledButton from "views/directory/StyledButton";
import { chevronLeftSVG } from "@components/dashboard/assets/svgs";
import { useRouter } from "next/router";

export default function Info() {
  const [criteria, setCriteria] = useState("");
  const router = useRouter();
  return (
    <PageWrapper>
      <PageHeader
        title={
          <>
            Exchange tokens at the <WordHighlight content="best" /> rate on the market.
          </>
        }
      />
      <Container>
        <div className="mb-10 -mt-4 flex justify-end">
          <StyledButton onClick={() => router.push("/swap")} className="!h-[32px] !w-[125px]">
            <div className="absolute left-2 top-[7px]">{chevronLeftSVG}</div>
            <div className="ml-2">Back to swap</div>
          </StyledButton>
        </div>
        <input
          type={"text"}
          placeholder="Search pair, token, symbol..."
          className="primary-shadow leading-1.2 focusShadow w-full rounded border-none bg-[#29292C] p-2.5 font-brand text-sm font-bold text-white"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        />
        <div className="mb-10 mt-5">
          <PairList />
        </div>
      </Container>
    </PageWrapper>
  );
}

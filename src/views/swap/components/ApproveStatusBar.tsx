import { checkCircleSVG } from "components/dashboard/assets/svgs";
import { CurrencyLogo } from "components/logo";
import { ReactNode } from "react";
import styled from "styled-components";

const ApproveStatusBar = ({ step, url }: { step: number; url: any }) => (
  <div className="mb-5 flex items-center justify-center">
    <div className="mr-6 font-roboto">One time approval required</div>
    <StyledLogo active={step > 0}>
      <CurrencyLogo currency={url} size="30px" />
    </StyledLogo>
    <StyledBorder active={step > 0} />
    <StyledLogo active={step > 1}>
      <img src="/images/brewlabsRouter.svg" alt={""} className="w-[30px]" />
    </StyledLogo>
    <StyledBorder active={step > 1} />
    <div className={step > 1 ? "text-green" : "text-[#FFFFFF80]"}>{checkCircleSVG}</div>
  </div>
);

const StyledBorder = styled.div<{ active: boolean }>`
  width: 25px;
  height: 1px;
  background-color: ${({ active }) => (active ? "#2FD35D" : "#ffffff80")};
  transition : all 0.3s;
`;

const StyledLogo = styled.div<{ active: boolean }>`
  padding: 1px;
  background: transparent;
  border-radius: 50%;
  border: 1px solid ${({ active }) => (active ? "#2FD35D" : "#ffffff80")};
  transition : all 0.3s;
`;

export default ApproveStatusBar;

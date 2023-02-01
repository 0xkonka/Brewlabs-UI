import LogoIcon from "components/LogoIcon";
import styled from "styled-components";
import StyledButton from "./StyledButton";
import { upSVG } from "components/dashboard/assets/svgs";

const CorePool = () => {
  const CreatePoolInfoPanel = (type: string) => {
    return (
      <PoolInfoPanel type={type}>
        <div className="w-full text-xs text-[#FFFFFF80]">
          <div className="flex flex-wrap justify-between">
            <div className="text-xl text-[#FFFFFFBF]">
              Core Pool: <span className="text-primary">BREWLABS</span>
            </div>
            <div className="text-xl text-primary">
              <span className="text-[#FFFFFFBF]">APR:</span> 25.24%
            </div>
          </div>
          <div className="flex flex-wrap justify-between text-base">
            <div>
              Stake <span className="text-primary">BREWLABS</span> earn <span className="text-primary">BREWLABS</span>
            </div>
            <div className="text-primary">Flexible</div>
          </div>
          <div className="flex flex-wrap items-start justify-between">
            <div>
              <div>Deposit Fee 0.10%</div>
              <div>Withdrawal Fee 0.10%</div>
              <div>Performance Fee 0.0035 BNB</div>
            </div>
            <div className="flex items-center text-primary">
              {upSVG}
              <div className="ml-2">Acending APR</div>
            </div>
          </div>
        </div>
      </PoolInfoPanel>
    );
  };
  return (
    <div className="rounded border border-[#FFFFFF40] bg-[#B9B8B80D] py-[22px] px-3 sm:px-5">
      <div className="flex max-w-[1120px] items-center justify-between">
        <LogoIcon classNames="w-24 min-w-[96px] text-dark dark:text-brand sm:ml-6 ml-0" />
        {CreatePoolInfoPanel("pc")}
        <div className="w-[50%] max-w-[200px] md:w-[340px] md:max-w-full">
          <div className="h-[50px]">
            <StyledButton>Get BREWLABS</StyledButton>
          </div>
          <div className="mt-2 h-[50px]">
            <StyledButton>Deposit BREWLABS</StyledButton>
          </div>
        </div>
      </div>
      {CreatePoolInfoPanel("mobile")}
    </div>
  );
};

const PoolInfoPanel = styled.div<{ type: string }>`
  border: 1px solid white;
  background: #b9b8b80d;
  padding: 14px 26px 8px 26px;
  border-radius: 4px;
  display: ${({ type }) => (type === "pc" ? "flex" : "none")};
  justify-content: space-between;
  width: 100%;
  max-width: 540px;
  margin: 0 20px;
  @media screen and (max-width: 768px) {
    display: ${({ type }) => (type !== "pc" ? "flex" : "none")};
    max-width: 100%;
    margin: 20px 0 0 0;
  }
  @media screen and (max-width: 640px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
export default CorePool;

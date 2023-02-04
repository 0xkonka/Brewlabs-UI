import LogoIcon from "components/LogoIcon";
import styled from "styled-components";
import StyledButton from "./StyledButton";
import { upSVG } from "components/dashboard/assets/svgs";
import { makeSkeletonComponent } from "utils/functions";
import { useContext } from "react";
import { PoolContext } from "contexts/PoolContext";

const CorePool = ({
  setSelectPoolDetail,
  index,
  setCurPool,
}: {
  setSelectPoolDetail: any;
  index: number;
  setCurPool: any;
}) => {
  const { data: pools }: any = useContext(PoolContext);
  const data = pools[index];

  const CreatePoolInfoPanel = (type: string) => {
    return (
      <PoolInfoPanel type={type}>
        <div className="w-full text-xs text-[#FFFFFF80]">
          <div className="flex flex-wrap justify-between">
            <div className="text-xl text-[#FFFFFFBF]">
              Core Pool: <span className="text-primary">{data.earningToken.symbol}</span>
            </div>
            <div className="flex text-xl text-primary">
              <span className="text-[#FFFFFFBF]">APR:</span>&nbsp;
              {data.apr !== undefined ? `${data.apr}%` : makeSkeletonComponent()}
            </div>
          </div>
          <div className="flex flex-wrap justify-between text-base">
            <div>
              Stake <span className="text-primary">{data.stakingToken.symbol}</span> earn{" "}
              <span className="text-primary">{data.earningToken.symbol}</span>
            </div>
            <div className="text-primary">{data.duration === 0 ? "Flexible" : `${data.duration} day lock`}</div>
          </div>
          <div className="flex flex-wrap items-start justify-between">
            <div>
              <div>Deposit Fee {data.depositFee.toFixed(2)}%</div>
              <div>Withdrawal Fee {data.withdrawFee.toFixed(2)}%</div>
              <div>Performance Fee {data.performanceFee / Math.pow(10, 18)} BNB</div>
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
          <a
            href={`https://bridge.brewlabs.info/swap?outputCurrency=${data.stakingToken.address}`}
            target={"_blank"}
            rel="noreferrer"
          >
            <div className="h-[50px]">
              <StyledButton>Get {data.stakingToken.symbol}</StyledButton>
            </div>
          </a>
          <div className="mt-2 h-[50px]">
            <StyledButton
              onClick={() => {
                setSelectPoolDetail(true);
                setCurPool(0);
              }}
            >
              Deposit {data.stakingToken.symbol}
            </StyledButton>
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

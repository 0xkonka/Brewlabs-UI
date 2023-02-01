import styled from "styled-components";
import { numberWithCommas } from "utils/functions";

const PoolCard = ({ data, index, setSelectPoolDetail }: { data: any; index: number; setSelectPoolDetail: any }) => {
  const poolNames = { 1: "Staking Pool", 2: "Yield Farms", 3: "Indexes", 4: "Zapper Pools" };
  return (
    <StyledContainer index={index} onClick={() => setSelectPoolDetail(true)}>
      <div className="flex items-center justify-between">
        <div className="min-w-[80px] pl-4">
          <img src={data.chainLogo} alt={""} className="w-9" />
        </div>
        <div className="flex min-w-[210px] items-center">
          <img src={data.earningToken.logo} alt={""} className="mr-3 w-7 rounded-full" />
          <div>
            <div className="leading-none">
              <span className="text-primary">Earn</span> {data.earningToken.symbol}
            </div>
            <div className="text-xs">
              {poolNames[data.type]} - {data.duration} day lock
            </div>
          </div>
        </div>
        <div className="min-w-[70px]">${data.tvl}</div>
        <div className="min-w-[160px]">{data.stakedAddresses}</div>
        <div className="min-w-[250px]">
          {numberWithCommas(data.totalStaked)} {data.stakingToken.symbol}
        </div>
        <div className="min-w-[70px]">{data.type !== 3 ? `${data.apr}%` : "N/A"}</div>
      </div>
      <div className="flex hidden flex-col px-6">
        <div className="flex  items-center justify-between ">
          <div className="flex items-center">
            <img src={data.earningToken.logo} alt={""} className="mr-3 w-7 rounded-full" />
            <div>
              <div className="leading-none">
                <span className="text-primary">Earn</span> {data.earningToken.symbol}
              </div>
              <div className="text-xs">Staking Pool - {data.duration} day lock</div>
            </div>
          </div>
          <img src={data.chainLogo} alt={""} className="w-9" />
        </div>
        <div className="mt-6 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="text-2xl">APR: {data.type !== 3 ? `${data.apr}%` : "N/A"}</div>
          <div>
            <div className="text-left xsm:text-right">Total supply staked</div>
            <div className="text-left text-sm xsm:text-right">
              {numberWithCommas(data.totalStaked)} {data.stakingToken.symbol}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div>TVL: ${data.tvl}</div>
          <div>Staked Address: {data.stakedAddresses}</div>
        </div>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ index: number }>`
  background: ${({ index }) => (index % 2 ? "#D9D9D91A" : "#D9D9D90D")};
  border-radius: 4px;
  color: #ffffffbf;
  font-size: 18px;
  padding: 15px 0;
  margin-bottom: 10px;
  transition: 0.3s all;
  border: 1px solid transparent;
  :hover {
    border-color: #ffde0d;
  }
  cursor: pointer;
  @media screen and (max-width: 1280px) {
    > div:nth-child(1) > div:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 1024px) {
    > div:nth-child(1) > div:nth-child(4) {
      display: unset;
    }
  }
  @media screen and (max-width: 1080px) {
    padding: 24px 0;
    > div:nth-child(1) {
      display: none;
    }
    > div:nth-child(2) {
      display: flex !important;
    }
  }
`;

export default PoolCard;

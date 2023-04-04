import styled from "styled-components";

import { CHAIN_ICONS } from "config/constants/networks";
import { Category, PoolCategory } from "config/constants/types";
import { formatAmount, formatTvl } from "utils/formatApy";
import { getIndexName, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import IndexLogo from "components/logo/IndexLogo";
import { SkeletonComponent } from "components/SkeletonComponent";

const poolNames = {
  [Category.POOL]: "Staking Pool",
  [Category.FARM]: "Yield Farms",
  [Category.INDEXES]: "Brewlabs Index",
  [Category.ZAPPER]: "Zapper Pools",
};

const PoolCard = ({
  data,
  index,
  setSelectPoolDetail,
  setCurPool,
}: {
  data: any;
  index: number;
  setSelectPoolDetail: any;
  setCurPool: any;
}) => {
  return (
    <StyledContainer
      index={index}
      onClick={() => {
        setSelectPoolDetail(true);
        switch (data.type) {
          case Category.POOL:
            setCurPool({ type: Category.POOL, pid: data.sousId });
            break;
          case Category.FARM:
            setCurPool({ type: Category.FARM, pid: data.farmId });
            break;
          case Category.INDEXES:
            setCurPool({ type: Category.INDEXES, pid: data.pid });
            break;
          case Category.ZAPPER:
            setCurPool({ type: Category.ZAPPER, pid: data.pid });
            break;
          default:
            setSelectPoolDetail(false);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[80px] pl-4">
          <img src={CHAIN_ICONS[data.chainId]} alt={""} className="w-9" />
        </div>
        <div className="flex min-w-[210px] items-center">
          {data.type === Category.INDEXES ? (
            <IndexLogo tokens={data.tokens} />
          ) : (
            <div className="mr-3 h-7 w-7 rounded-full border border-white bg-white">
              <img
                src={getTokenLogoURL(data.earningToken.address, data.earningToken.chainId)}
                alt={""}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            {data.type === Category.INDEXES ? (
              <div className="leading-none">{getIndexName(data.tokens)}</div>
            ) : (
              <div className="leading-none">
                <span className="text-primary">Earn</span> {data.earningToken.symbol}
              </div>
            )}
            <div className="text-xs">
              {poolNames[data.type]} -{" "}
              {data.poolCategory === PoolCategory.CORE || data.type !== Category.POOL
                ? "Flexible"
                : `${data.duration} days lock`}
            </div>
          </div>
        </div>
        <div className="min-w-[70px]">
          {data.tvl || data.tvl === 0.0 ? `${formatTvl(data.tvl, 1)}` : <SkeletonComponent />}
        </div>
        <div className="min-w-[250px]">
          {data.totalStaked !== undefined ? (
            data.type === Category.INDEXES ? (
              <div className="leading-none">
                {data.tokens.map((t, index) => (
                  <div key={index} className="text-[14px]">
                    {formatAmount(data.totalStaked[index])} {t.symbol}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {formatAmount(data.totalStaked)}{" "}
                {[Category.FARM, Category.ZAPPER].includes(data.type)
                  ? data.lpSymbol.split(" ")[0]
                  : data.stakingToken.symbol}
              </>
            )
          ) : (
            <SkeletonComponent />
          )}
        </div>
        <div className="min-w-[80px]">
          {data.type !== Category.INDEXES ? (
            data.apr || data.apr === 0.0 ? (
              `${(+data.apr).toFixed(2)}%`
            ) : (
              <div className="mr-2">{<SkeletonComponent />}</div>
            )
          ) : (
            "N/A"
          )}
        </div>
      </div>
      <div className="flex hidden flex-col px-6">
        <div className="flex  items-center justify-between ">
          <div className="flex items-center">
            {data.type === 3 ? (
              <div className="mr-3 flex">
                <img src={"/images/directory/ogv.svg"} alt={""} className="w-9 rounded-full" />
                <img src={"/images/directory/ogn.svg"} alt={""} className="-ml-3 w-9 rounded-full" />
              </div>
            ) : (
              <img
                src={getTokenLogoURL(data.earningToken.address, data.earningToken.chainId)}
                alt={""}
                className="mr-3 w-7 rounded-full"
              />
            )}
            <div>
              <div className="leading-none">
                {data.type === Category.INDEXES ? (
                  <>{getIndexName(data.tokens)}</>
                ) : (
                  <>
                    <span className="text-primary">Earn</span> {data.earningToken.symbol}
                  </>
                )}
              </div>
              <div className="text-xs">
                {poolNames[data.type]} - {data.lockup === undefined ? "Flexible" : `${data.duration} day lock`}
              </div>
            </div>
          </div>
          <img src={CHAIN_ICONS[data.chainId]} alt={""} className="w-9" />
        </div>
        <div className="mt-6 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="flex text-2xl">
            APR:&nbsp;
            {data.type !== 3 ? (
              data.apr !== undefined ? (
                `${(+data.apr).toFixed(2)}%`
              ) : (
                <div className="mr-2">{<SkeletonComponent />}</div>
              )
            ) : (
              "N/A"
            )}
          </div>
          <div>
            <div className="text-left xsm:text-right">Total supply staked</div>
            <div className="text-left text-sm xsm:text-right">
              {data.totalStaked !== undefined ? (
                data.type === Category.INDEXES ? (
                  <div className="leading-none">
                    {data.tokens.map((t, index) => (
                      <div className="text-[14px]">
                        {formatAmount(data.totalStaked[index])} {t.symbol}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {formatAmount(data.totalStaked)}{" "}
                    {[Category.FARM, Category.ZAPPER].includes(data.type)
                      ? data.lpSymbol.split(" ")[0]
                      : data.stakingToken.symbol}
                  </>
                )
              ) : (
                <SkeletonComponent />
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col items-start justify-between xsm:flex-row xsm:items-center">
          <div className="flex">
            TVL:&nbsp;{data.tvl !== undefined ? `$${numberWithCommas(data.tvl.toFixed(2))}` : <SkeletonComponent />}
          </div>
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

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useState } from "react";
import { ChainId } from "@brewlabs/sdk";
import BigNumber from "bignumber.js";
import orderBy from "lodash/orderBy";
import { useAccount } from "wagmi";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";

import { AppId, Category } from "config/constants/types";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useFarms } from "state/farms/hooks";
import {
  useBananaPrice,
  useFarmLpAprsFromAppId,
  useFetchFarmLpAprs,
  usePollFarms,
  usePollFarmsWithUserData,
  usePriceCakeBusd,
  useSetFarms,
  useFarms as useZaps,
} from "state/zap/hooks";
import { usePools } from "state/pools/hooks";
import { useIndexes } from "state/indexes/hooks";
import { useChainCurrentBlocks } from "state/block/hooks";
import { filterPoolsByStatus } from "utils";
import { getFarmApr } from "utils/apr";
import getCurrencyId from "utils/getCurrencyId";

import PoolList from "./PoolList";
import SelectionPanel from "./SelectionPanel";

import IndexDetail from "./IndexDetail";
import FarmingDetail from "./FarmingDetail";
import StakingDetail from "./StakingDetail";
import ZapperDetail from "./ZapperDetail";
import StyledButton from "./StyledButton";
import Link from "next/link";
import contents from "./contents";

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [sortOrder, setSortOrder] = useState("tvl");
  const [curPool, setCurPool] = useState<{ type: Category; pid: number; chainId: number }>({
    type: 0,
    pid: 0,
    chainId: 0,
  });
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);
  const [status, setStatus] = useState("active");

  const { address: account } = useAccount();
  const { pools, dataFetched } = usePools();
  const { data: farms } = useFarms();
  const { indexes } = useIndexes();
  const { data: zaps, regularCakePerBlock } = useZaps(account);

  const cakePrice = usePriceCakeBusd();
  const bananaPrice = useBananaPrice();
  const pancakeLpAprs = useFarmLpAprsFromAppId(AppId.PANCAKESWAP);

  useSetFarms();
  usePollFarms();
  usePollFarmsWithUserData();
  useFetchFarmLpAprs(ChainId.BSC_MAINNET);

  const farmsList = useCallback(
    (farmsToDisplay) => {
      let farmsToDisplayWithAPR = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return { ...farm, liquidity: new BigNumber(farm.liquidity) };
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd);
        const { cakeRewardsApr } = getFarmApr(
          new BigNumber(farm.poolWeight),
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          new BigNumber(regularCakePerBlock),
          ChainId.BSC_MAINNET
        );

        const lpRewardsApr = pancakeLpAprs[farm.lpAddress?.toLocaleLowerCase()] ?? 0;
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity };
      });

      return farmsToDisplayWithAPR;
    },
    [cakePrice, regularCakePerBlock, pancakeLpAprs]
  );

  const { tokenPrices, lpPrices } = useContext(TokenPriceContext);
  const currentBlocks = useChainCurrentBlocks();
  const allPools = [
    ...pools
      .filter((p) => p.visible)
      .map((pool) => {
        let price = tokenPrices[getCurrencyId(pool.chainId, pool.stakingToken.address)];
        if (price > 500000) price = 0;
        return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
      }),
    ...farms
      .filter((p) => p.visible)
      .map((farm) => {
        let price = lpPrices[getCurrencyId(farm.chainId, farm.lpAddress, true)];
        return { ...farm, tvl: farm.totalStaked && price ? +farm.totalStaked * price : 0 };
      }),
    ...indexes
      .filter((p) => p.visible)
      .sort((a, b) => (b.category === undefined ? 0 : 1) - (a.category === undefined ? 0 : 1))
      .map((_index) => {
        let tvl = 0;
        for (let i = 0; i < _index.tokens.length; i++) {
          let price = _index.tokenPrices?.[i] ?? tokenPrices[getCurrencyId(_index.chainId, _index.tokens[i].address)];
          tvl += _index.totalStaked?.[i] && price ? +_index.totalStaked[i] * price : 0;
        }
        return { ..._index, tvl };
      }),
    ...farmsList(zaps).map((zap) => {
      return {
        ...zap,
        type: Category.ZAPPER,
        tvl: zap.liquidity.toNumber(),
        totalStaked: zap.totalSupply === undefined ? undefined : zap.totalSupply / Math.pow(10, 18),
      };
    }),
  ];

  const sortPools = (poolsToSort) => {
    switch (sortOrder) {
      case "apr":
        return orderBy(poolsToSort, (pool) => pool.apr ?? 0, "desc");
      case "earned":
        return orderBy(
          poolsToSort,
          (pool) => {
            const earningTokenPrice = +tokenPrices[getCurrencyId(pool.earningToken.chainId, pool.earningToken.address)];
            if (!pool.userData || !earningTokenPrice) {
              return 0;
            }
            return pool.userData.earnings.times(earningTokenPrice).toNumber();
          },
          "desc"
        );
      case "tvl":
        return orderBy(poolsToSort, (pool) => pool.tvl ?? 0, "desc");
      case "totalStaked":
        return orderBy(
          poolsToSort,
          (pool) => {
            let totalStaked = Number.NaN;
            if (pool.totalStaked !== Infinity && pool.totalStaked !== undefined) {
              totalStaked = +pool.totalStaked.toString();
            }
            return Number.isFinite(totalStaked) ? totalStaked : 0;
          },
          "desc"
        );
      case "chainId":
        return orderBy(poolsToSort, (pool) => pool.chainId, "asc");
      case "latest":
        return orderBy(poolsToSort, (pool) => pool.sortOrder, "desc");
      default:
        return orderBy(poolsToSort, (pool) => pool.sortOrder, "asc");
    }
  };

  let chosenPools;
  if (curFilter >= 0 || criteria) {
    const lowercaseQuery = criteria.toLowerCase();
    chosenPools = allPools
      .filter(
        (pool: any) =>
          pool.stakingToken?.name.toLowerCase().includes(lowercaseQuery) ||
          pool.stakingToken?.symbol.toLowerCase().includes(lowercaseQuery) ||
          pool.lpSymbol?.toLowerCase().includes(lowercaseQuery) ||
          pool.earningToken?.name.toLowerCase().includes(lowercaseQuery) ||
          pool.earningToken?.symbol.toLowerCase().includes(lowercaseQuery) ||
          pool.tokens?.filter(
            (t) => t.name.toLowerCase().includes(lowercaseQuery) || t.symbol.toLowerCase().includes(lowercaseQuery)
          ).length
      )
      .filter(
        (data: any) =>
          curFilter === Category.ALL ||
          data.type === curFilter ||
          (curFilter === Category.MY_POSITION &&
            (data.type === Category.INDEXES
              ? +data.userData?.stakedUsdAmount > 0
              : data.userData?.stakedBalance?.gt(0)))
      );
  }
  chosenPools = sortPools(
    filterPoolsByStatus(chosenPools, currentBlocks, curFilter === Category.MY_POSITION ? "all" : status)
  );

  const renderDetailPage = () => {
    switch (curPool.type) {
      case Category.POOL:
        return (
          <StakingDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find(
                (pool: any) =>
                  pool.type === curPool.type && pool.sousId === curPool.pid && pool.chainId === curPool.chainId
              ),
            }}
          />
        );
      case Category.FARM:
        return (
          <FarmingDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find(
                (pool: any) =>
                  pool.type === curPool.type && pool["pid"] === curPool.pid && pool.chainId === curPool.chainId
              ),
            }}
          />
        );
      case Category.INDEXES:
        return (
          <IndexDetail
            detailDatas={{
              data: allPools.find(
                (pool: any) =>
                  pool.type === curPool.type && pool["pid"] === curPool.pid && pool.chainId === curPool.chainId
              ),
            }}
          />
        );

      case Category.ZAPPER:
        return (
          <ZapperDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find(
                (pool: any) =>
                  pool.type === curPool.type && pool["pid"] === curPool.pid && pool.chainId === curPool.chainId
              ),
              cakePrice,
              bananaPrice,
            }}
          />
        );
      default:
        return "";
    }
  };

  const content = contents[curFilter === Category.INDEXES ? "indexes" : "invest"];

  return (
    <PageWrapper>
      {renderDetailPage()}

      {!selectPoolDetail && (
        <div>
          <PageHeader title={content.header} summary={content.body} tagline={content?.tagline}>
            <a className="btn mt-4" target="_blank" href={content.link}>
              <DocumentTextIcon className="h-auto w-6" />
              Learn more
            </a>
          </PageHeader>

          <Container className="font-brand xl:mt-32">
            <div className="flex items-center justify-end">
              {curFilter === Category.FARM && (
                <Link className="btn btn-sm  bg-brand text-gray-800" href="/deployer/farm">
                  Create Farm
                </Link>
              )}
              {curFilter === Category.INDEXES && (
                <Link className="btn btn-sm bg-brand text-gray-800" href="/deployer/index">
                  Create Index
                </Link>
              )}
            </div>

            <div className="mt-8">
              <SelectionPanel
                pools={allPools}
                curFilter={curFilter}
                setCurFilter={setCurFilter}
                criteria={criteria}
                setCriteria={setCriteria}
                activity={status}
                setActivity={setStatus}
              />
            </div>
            <div className="mb-[100px] mt-[18px]">
              <PoolList
                pools={chosenPools}
                setSelectPoolDetail={setSelectPoolDetail}
                setCurPool={setCurPool}
                setSortOrder={setSortOrder}
                loading={dataFetched}
                curFilter={curFilter}
              />
            </div>
          </Container>
        </div>
      )}
    </PageWrapper>
  );
};

export default Directory;

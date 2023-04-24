/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import orderBy from "lodash/orderBy";

import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";

import { BLOCKS_PER_DAY } from "config/constants";
import { AppId, Category } from "config/constants/types";
import { ZapperContext } from "contexts/directory/ZapperContext";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useFarms } from "state/farms/hooks";
import {
  useAppId,
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
import getCurrencyId from "utils/getCurrencyId";

import Banner from "./Banner";
import PoolList from "./PoolList";
import SelectionPanel from "./SelectionPanel";
import DeployerModal from "./DeployerModal";

import IndexDetail from "./IndexDetail";
import FarmingDetail from "./FarmingDetail";
import StakingDetail from "./StakingDetail";
import ZapperDetail from "./ZapperDetail";
import { useAccount } from "wagmi";
import BigNumber from "bignumber.js";
import { getFarmApr } from "utils/apr";
import { ChainId } from "@brewlabs/sdk";
import { latinise } from "utils/latinise";
import { useActiveChainId } from "@hooks/useActiveChainId";
import StyledButton from "./StyledButton";
import { chevronLeftSVG } from "@components/dashboard/assets/svgs";

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [curPool, setCurPool] = useState<{ type: Category; pid: number; chainId: number }>({
    type: 0,
    pid: 0,
    chainId: 0,
  });
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);
  const [status, setStatus] = useState("active");
  const [deployerOpen, setDeployerOpen] = useState(false);

  const { address: account } = useAccount();
  const { pools, dataFetched } = usePools();
  const { data: farms } = useFarms();
  const { indexes } = useIndexes();
  const { data: zaps, regularCakePerBlock } = useZaps(account);

  const cakePrice = usePriceCakeBusd();
  const bananaPrice = useBananaPrice();
  const pancakeLpAprs = useFarmLpAprsFromAppId(AppId.PANCAKESWAP);
  const [query, setQuery] = useState("");

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

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase());
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery);
        });
      }
      return farmsToDisplayWithAPR;
    },
    [query, cakePrice, regularCakePerBlock, pancakeLpAprs]
  );

  const { tokenPrices, lpPrices } = useContext(TokenPriceContext);
  const currentBlocks = useChainCurrentBlocks();
  const allPools = [
    ...pools.map((pool) => {
      let price = tokenPrices[getCurrencyId(pool.chainId, pool.stakingToken.address)];
      if (price > 500000) price = 0;
      return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
    }),
    ...farms.map((farm) => {
      let price = lpPrices[getCurrencyId(farm.chainId, farm.lpAddress, true)];
      return { ...farm, tvl: farm.totalStaked && price ? +farm.totalStaked * price : 0 };
    }),
    ...indexes.map((_index) => {
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
            (data.type === Category.INDEXES ? +data.userData?.stakedUsdAmount > 0 : data.userData?.stakedBalance?.gt(0)))
      );
  }

  switch (status) {
    case "finished":
      chosenPools = chosenPools.filter(
        (pool) =>
          pool.isFinished ||
          pool.multiplier === 0 ||
          (pool.type === Category.ZAPPER && pool.pid !== 0 && pool.multiplier === "0X")
      );
      break;
    case "new":
      chosenPools = chosenPools.filter(
        (pool) =>
          !pool.isFinished &&
          ((pool.type === Category.POOL &&
            (+pool.startBlock === 0 ||
              +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])) ||
            (pool.type === Category.FARM &&
              (+pool.startBlock > currentBlocks[pool.chainId] ||
                +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])) ||
            (pool.type === Category.INDEXES && new Date(pool.createdAt).getTime() + 86400 * 1000 >= Date.now()))
      );
      break;
    default:
      chosenPools = chosenPools.filter(
        (pool) =>
          !pool.isFinished &&
          ((pool.type === Category.POOL && +pool.startBlock > 0) ||
            (pool.type === Category.FARM && pool.multiplier > 0 && +pool.startBlock < currentBlocks[pool.chainId]) ||
            pool.type === Category.INDEXES ||
            (pool.type === Category.ZAPPER && pool.pid !== 0 && pool.multiplier !== "0X"))
      );
  }
  chosenPools = sortPools(chosenPools);
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

  return (
    <PageWrapper>
      <DeployerModal open={deployerOpen} setOpen={setDeployerOpen} />
      {renderDetailPage()}

      <AnimatePresence>
        {!selectPoolDetail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-0 left-0 max-h-screen w-full overflow-y-scroll">
              <PageHeader
                title={
                  <div className="text-[40px]">
                    <WordHighlight content="Brewlabs Pool Directory" />
                    <div className="whitespace-wrap mt-5 text-xl font-normal sm:whitespace-nowrap">
                      Stake, farm, zap and explore indexes for passive income
                    </div>
                  </div>
                }
              />
              <Container className="font-brand">
                <div className="mb-4 flex justify-end">
                  <div className="h-[32px] w-[140px] font-roboto">
                    <StyledButton onClick={() => setDeployerOpen(true)}>
                      <div className="flex items-center">
                        <div className="ml-1">Deploy Product</div>
                        <div className="ml-1 -scale-100">{chevronLeftSVG}</div>
                      </div>
                    </StyledButton>
                  </div>
                </div>
                <Banner setSelectPoolDetail={setSelectPoolDetail} setCurPool={setCurPool} allPools={allPools} />

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
                <div className="mt-[18px] mb-[100px]">
                  <PoolList
                    pools={chosenPools}
                    setSelectPoolDetail={setSelectPoolDetail}
                    setCurPool={setCurPool}
                    setSortOrder={setSortOrder}
                    loading={dataFetched}
                  />
                </div>
              </Container>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Directory;

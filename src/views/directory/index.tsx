/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import orderBy from "lodash/orderBy";

import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";

import { BLOCKS_PER_DAY } from "config/constants";
import { Category } from "config/constants/types";
import { IndexContext } from "contexts/directory/IndexContext";
import { FarmContext } from "contexts/directory/FarmContext";
import { ZapperContext } from "contexts/directory/ZapperContext";
import { useTokenPrices } from "hooks/useTokenPrice";
import { usePools } from "state/pools/hooks";
import { useChainCurrentBlocks } from "state/block/hooks";
import getCurrencyId from "utils/getCurrencyId";

import Banner from "./Banner";
import PoolList from "./PoolList";
import SelectionPanel from "./SelectionPanel";
import IndexDetail from "./IndexDetail";
import FarmingDetail from "./FarmingDetail";
import StakingDetail from "./StakingDetail";
import ZapperDetail from "./ZapperDetail";

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [curPool, setCurPool] = useState<{ type: Category; pid: number }>({ type: 0, pid: 0 });
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);
  const [status, setStatus] = useState("active");

  const { pools } = usePools();
  const prices = useTokenPrices();
  const currentBlocks = useChainCurrentBlocks();

  // const { data: pools, accountData: accountPoolDatas }: any = useContext(PoolContext);
  const { data: farms, accountData: accountFarms }: any = useContext(FarmContext);
  const { data: indexes, accountData: accountIndexDatas }: any = useContext(IndexContext);
  const { data: zappers, accountData: accountZapperDatas }: any = useContext(ZapperContext);

  const allPools = [
    ...pools.map((pool) => {
      let price = prices[getCurrencyId(pool.chainId, pool.earningToken.address)];
      if (price > 500000) price = 0;
      return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
    }),
    ...farms,
    ...indexes,
    ...zappers,
  ];

  const sortPools = (poolsToSort) => {
    switch (sortOrder) {
      case "apr":
        return orderBy(poolsToSort, (pool) => pool.apr ?? 0, "desc");
      case "earned":
        return orderBy(
          poolsToSort,
          (pool) => {
            const earningTokenPrice = +prices[getCurrencyId(pool.earningToken.chainId, pool.earningToken.address)];
            if (!pool.userData || !earningTokenPrice) {
              return 0;
            }
            return pool.userData.pendingReward.times(earningTokenPrice).toNumber();
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
            if (pool.totalStaked?.isFinite()) {
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
        (pool) =>
          pool.stakingToken.name.toLowerCase().includes(lowercaseQuery) ||
          pool.stakingToken.symbol.toLowerCase().includes(lowercaseQuery) ||
          pool.earningToken.name.toLowerCase().includes(lowercaseQuery) ||
          pool.earningToken.symbol.toLowerCase().includes(lowercaseQuery)
      )
      .filter(
        (data) => curFilter === 0 || data.type === curFilter || (curFilter === 5 && data.userData?.stakedBalance.gt(0))
      );
  }

  switch (status) {
    case "finished":
      chosenPools = chosenPools.filter((pool) => pool.isFinished);
      break;
    case "new":
      chosenPools = chosenPools.filter(
        (pool) =>
          !pool.isFinished &&
          (+pool.startBlock === 0 || +pool.startBlock + BLOCKS_PER_DAY[pool.chainId] > currentBlocks[pool.chainId])
      );
      break;
    default:
      chosenPools = chosenPools.filter((pool) => !pool.isFinished && +pool.startBlock > 0);
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
              data: allPools.find((pool) => pool.type === curPool.type && pool.sousId === curPool.pid),
            }}
          />
        );
      case Category.FARM:
        return (
          <FarmingDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find((pool) => pool.type === curPool.type && pool["pid"] === curPool.pid),
              accountData: accountFarms,
            }}
          />
        );
      case Category.INDEXES:
        return (
          <IndexDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find((pool) => pool.type === curPool.type && pool["pid"] === curPool.pid),
              accountData: accountIndexDatas,
            }}
          />
        );

      case Category.ZAPPER:
        return (
          <ZapperDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find((pool) => pool.type === curPool.type && pool["pid"] === curPool.pid),
              accountData: accountZapperDatas,
            }}
          />
        );
      default:
        return "";
    }
  };

  return (
    <PageWrapper>
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
                    prices={prices}
                    setSelectPoolDetail={setSelectPoolDetail}
                    setCurPool={setCurPool}
                    setSortOrder={setSortOrder}
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

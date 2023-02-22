/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";

import { Category } from "config/constants/types";
import { IndexContext } from "contexts/directory/IndexContext";
import { useTokenPrices } from "hooks/useTokenPrice";
import { usePools } from "state/pools/hooks";
import getCurrencyId from "utils/getCurrencyId";

// import CorePool from "./CorePool";
import IndexDetail from "./IndexDetail";
import PoolList from "./PoolList";
import SelectionPanel from "./SelectionPanel";
import StakingDetail from "./StakingDetail";

import styled from "styled-components";
import Banner from "./Banner";
import { FarmContext } from "contexts/directory/FarmContext";
import FarmingDetail from "./FarmingDetail";
import { ZapperContext } from "contexts/directory/ZapperContext";
import ZapperDetail from "./ZapperDetail";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1400 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 1400, min: 1000 },
    items: 1,
  },
  small: {
    breakpoint: { max: 1000, min: 100 },
    items: 1,
  },
};

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [curPool, setCurPool] = useState<{ type: Category; pid: number }>({ type: 0, pid: 0 });
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);

  const { pools } = usePools();
  const prices = useTokenPrices();

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
      .filter((data) => curFilter === 0 || data.type === curFilter);
  }

  // const detailDatas = {
  //   open: selectPoolDetail,
  //   setOpen: setSelectPoolDetail,
  //   data: allPools[curPool],
  //   accountData: allAccountDatas[curPool],
  // };

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
      case Category.INDEXES:
        return (
          <IndexDetail
            detailDatas={{
              open: selectPoolDetail,
              setOpen: setSelectPoolDetail,
              data: allPools.find((pool) => pool.type === curPool.type && pool["pid"] === curPool.pid),
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
                {/* <CorePool
                  setSelectPoolDetail={setSelectPoolDetail}
                  index={195}
                  setCurPool={setCurPool}
                  pools={allPools}
                /> */}

                <Banner setSelectPoolDetail={setSelectPoolDetail} setCurPool={setCurPool} allPools={allPools} />

                <div className="mt-8">
                  <SelectionPanel
                    pools={allPools}
                    curFilter={curFilter}
                    setCurFilter={setCurFilter}
                    criteria={criteria}
                    setCriteria={setCriteria}
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

const DotGroup = styled.div<{ active?: boolean }>`
  width: calc(100vw / 1440 * 50);
  height: 4px;
  margin-right: 10px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "deeppink" : "white")};
  filter: blur(1px);
  transition: all 0.5s;
  @media screen and (max-width: 700px) {
    width: calc(100vw / 700 * 45);
    height: 3px;
  }
`;

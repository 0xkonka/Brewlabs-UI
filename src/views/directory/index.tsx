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

import CorePool from "./CorePool";
import IndexDetail from "./IndexDetail";
import PoolList from "./PoolList";
import SelectionPanel from "./SelectionPanel";
import StakingDetail from "./StakingDetail";

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [filteredData, setFilteredData] = useState([]);
  const [curPool, setCurPool] = useState<{ type: Category; pid: number }>({ type: 0, pid: 0 });
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);

  const { pools } = usePools();
  const prices = useTokenPrices();

  const { data: indexes, accountData: accountIndexDatas }: any = useContext(IndexContext);

  const allPools = [
    ...pools.map((pool) => {
      let price = prices[getCurrencyId(pool.chainId, pool.earningToken.address)];
      if (price > 500000) price = 0;
      return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
    }),
    ...indexes,
  ];

  useEffect(() => {
    const filtered = allPools.filter(
      (data: any) =>
        data.stakingToken.name.toLowerCase().includes(criteria.toLowerCase()) ||
        data.stakingToken.symbol.toLowerCase().includes(criteria.toLowerCase()) ||
        data.earningToken.name.toLowerCase().includes(criteria.toLowerCase()) ||
        data.earningToken.symbol.toLowerCase().includes(criteria.toLowerCase())
    );
    if (curFilter === 0) setFilteredData(allPools);
    else setFilteredData(filtered.filter((data: any) => data.type === curFilter));
  }, [curFilter, criteria, allPools]);

  const renderDetailPage = () => {
    switch (curPool.type) {
      case Category.POOL:
        return (
          <StakingDetail
            open={selectPoolDetail}
            setOpen={setSelectPoolDetail}
            data={allPools.find((pool) => pool.type === curPool.type && pool.sousId === curPool.pid)}
          />
        );
      case Category.INDEXES:
        return (
          <IndexDetail
            open={selectPoolDetail}
            setOpen={setSelectPoolDetail}
            data={allPools.find((pool) => pool.type === curPool.type && pool.pid === curPool.pid)}
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
                    <div className="text-xl font-normal">By Brewlabs</div>
                  </div>
                }
                summary="Words to go here..."
              />
              <Container className="font-brand">
                <CorePool
                  setSelectPoolDetail={setSelectPoolDetail}
                  index={195}
                  setCurPool={setCurPool}
                  pools={allPools}
                />
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
                    pools={filteredData}
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

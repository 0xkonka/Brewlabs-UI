/* eslint-disable react-hooks/exhaustive-deps */
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import CorePool from "./CorePool";
import SelectionPanel from "./SelectionPanel";
import PoolList from "./PoolList";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StakingDetail from "./StakingDetail";
import IndexDetail from "./IndexDetail";
import { PoolContext } from "contexts/directory/PoolContext";
import { IndexContext } from "contexts/directory/IndexContext";
import { usePools } from "state/pools/hooks";
import { useTokenPrices } from "hooks/useTokenPrice";

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [curPool, setCurPool] = useState(0);
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);

  const {pools: _pools} = usePools()
  const prices = useTokenPrices()

  const { data: pools, accountData: accountPoolDatas }: any = useContext(PoolContext);
  const { data: indexes, accountData: accountIndexDatas }: any = useContext(IndexContext);

  const allPools = [..._pools, ...indexes],
    allAccountDatas = [...accountPoolDatas, accountIndexDatas];

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
  }, [curFilter, criteria, pools, indexes]);

  return (
    <PageWrapper>
      {allPools[curPool] ? (
        allPools[curPool].type === 1 ? (
          <StakingDetail
            open={selectPoolDetail}
            setOpen={setSelectPoolDetail}
            data={allPools[curPool]}
            accountData={allAccountDatas[curPool]}
          />
        ) : (
          <IndexDetail
            open={selectPoolDetail}
            setOpen={setSelectPoolDetail}
            data={allPools[curPool]}
            accountData={allAccountDatas[curPool]}
          />
        )
      ) : (
        ""
      )}
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
                  <PoolList pools={filteredData} prices={prices} setSelectPoolDetail={setSelectPoolDetail} setCurPool={setCurPool} />
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

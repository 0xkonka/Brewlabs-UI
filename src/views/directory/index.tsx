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
import StakingDetail from "./PoolDetails/StakingDetail";
import { PoolContext } from "contexts/PoolContext";

const Directory = ({ page }: { page: number }) => {
  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [curPool, setCurPool] = useState(0);
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);

  const { data: pools }: any = useContext(PoolContext);

  useEffect(() => {
    const filtered = pools.filter(
      (data: any) =>
        data.stakingToken.name.toLowerCase().includes(criteria.toLowerCase()) ||
        data.stakingToken.symbol.toLowerCase().includes(criteria.toLowerCase()) ||
        data.earningToken.name.toLowerCase().includes(criteria.toLowerCase()) ||
        data.earningToken.symbol.toLowerCase().includes(criteria.toLowerCase())
    );
    if (curFilter === 0) setFilteredData(filtered);
    else setFilteredData(filtered.filter((data: any) => data.type === curFilter));
  }, [curFilter, criteria, pools]);

  return (
    <PageWrapper>
      <StakingDetail open={selectPoolDetail} setOpen={setSelectPoolDetail} index={curPool} />
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
                <CorePool setSelectPoolDetail={setSelectPoolDetail} index={0} setCurPool={setCurPool} />
                <div className="mt-8">
                  <SelectionPanel
                    pools={pools}
                    curFilter={curFilter}
                    setCurFilter={setCurFilter}
                    criteria={criteria}
                    setCriteria={setCriteria}
                  />
                </div>
                <div className="mt-[18px] mb-[100px]">
                  <PoolList pools={filteredData} setSelectPoolDetail={setSelectPoolDetail} setCurPool={setCurPool} />
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

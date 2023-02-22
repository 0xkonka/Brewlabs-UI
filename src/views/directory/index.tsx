/* eslint-disable react-hooks/exhaustive-deps */
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import SelectionPanel from "./SelectionPanel";
import PoolList from "./PoolList";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StakingDetail from "./StakingDetail";
import IndexDetail from "./IndexDetail";
import { PoolContext } from "contexts/directory/PoolContext";
import { IndexContext } from "contexts/directory/IndexContext";
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
  const [filteredData, setFilteredData] = useState([]);
  const [curPool, setCurPool] = useState(0);
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);

  const { data: pools, accountData: accountPoolDatas }: any = useContext(PoolContext);
  const { data: farms, accountData: accountFarms }: any = useContext(FarmContext);
  const { data: indexes, accountData: accountIndexDatas }: any = useContext(IndexContext);
  const { data: zappers, accountData: accountZapperDatas }: any = useContext(ZapperContext);

  const allPools = [...pools, ...farms, ...indexes, ...zappers],
    allAccountDatas = [...accountPoolDatas, ...accountFarms, accountIndexDatas, ...accountZapperDatas];

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
  }, [curFilter, criteria, pools, indexes, farms, zappers]);

  const detailDatas = {
    open: selectPoolDetail,
    setOpen: setSelectPoolDetail,
    data: allPools[curPool],
    accountData: allAccountDatas[curPool],
  };

  return (
    <PageWrapper>
      {allPools[curPool] ? (
        allPools[curPool].type === 1 ? (
          <StakingDetail detailDatas={detailDatas} />
        ) : allPools[curPool].type === 2 ? (
          <FarmingDetail detailDatas={detailDatas} />
        ) : allPools[curPool].type === 4 ? (
          <ZapperDetail detailDatas={detailDatas} />
        ) : (
          <IndexDetail detailDatas={detailDatas} />
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
                    <div className="mt-5 whitespace-nowrap text-xl font-normal">
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

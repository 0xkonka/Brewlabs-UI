/* eslint-disable react-hooks/exhaustive-deps */
import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import CorePool from "./CorePool";
import SelectionPanel from "./SelectionPanel";
import PoolList from "./PoolList";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Directory = ({ page }: { page: number }) => {
  let pools = [];
  for (let i = 0; i < 20; i++) {
    pools.push({
      type: 1, //staking
      chainID: 56,
      chainLogo: "/images/directory/bsc.svg",
      stakingToken: {
        address: "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
        symbol: "BREWLABS",
        name: "Brewlabs",
        decimals: 9,
        logo: "https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png",
      },
      earningToken: {
        address: "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
        symbol: "BREWLABS",
        name: "Brewlabs",
        decimals: 9,
        logo: "https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png",
      },
      duration: 180,
      tvl: 52023,
      stakedAddresses: 52023,
      totalStaked: 7523241,
      apr: 25.22,
    });
  }

  for (let i = 0; i < 10; i++) {
    pools.push({
      type: 2, //farming
      chainID: 56,
      chainLogo: "/images/directory/bsc.svg",
      stakingToken: {
        address: "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
        symbol: "Brewlabs-BNB LP",
        name: "Brewlabs-BNB LP",
        decimals: 9,
        logo: "https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png",
      },
      earningToken: {
        address: "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
        symbol: "BREWLABS",
        name: "Brewlabs",
        decimals: 9,
        logo: "https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png",
      },
      duration: 180,
      tvl: 52023,
      stakedAddresses: 52023,
      totalStaked: 7523241,
      apr: 25.22,
    });
  }

  for (let i = 0; i < 5; i++) {
    pools.push({
      type: 3, //indexes
      chainID: 56,
      chainLogo: "/images/directory/bsc.svg",
      stakingToken: {
        address: "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
        symbol: "OGN-OGV",
        name: "OGN-OGV",
        decimals: 9,
        logo: "https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png",
      },
      earningToken: {
        address: "0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7",
        symbol: "BREWLABS",
        name: "Brewlabs",
        decimals: 9,
        logo: "https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png",
      },
      duration: 180,
      tvl: 52023,
      stakedAddresses: 52023,
      totalStaked: 7523241,
      apr: null,
    });
  }

  const [curFilter, setCurFilter] = useState(page);
  const [criteria, setCriteria] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [curPool, setCurPool] = useState(0);
  const [selectPoolDetail, setSelectPoolDetail] = useState(false);

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
  }, [curFilter, criteria]);

  return (
    <PageWrapper>
      <AnimatePresence>
        {!selectPoolDetail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
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
              <CorePool />
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
                <PoolList pools={filteredData} setSelectPoolDetail={setSelectPoolDetail} />
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Directory;

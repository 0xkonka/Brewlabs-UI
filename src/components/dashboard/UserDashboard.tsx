import { useContext, useEffect, useState } from "react";

import LogoIcon from "../LogoIcon";
import PerformanceChart from "./PerformanceChart";
import SwitchButton from "./SwitchButton";
import TokenList from "./TokenList";
import FullOpenVector from "./FullOpenVector";

import { DashboardContext } from "contexts/DashboardContext";
import SwapPanel from "views/swap/SwapPanel";
import NavButton from "./NavButton";
import { SwapContext } from "contexts/SwapContext";
import PriceList from "./PriceList";
import styled from "styled-components";

const UserDashboard = () => {
  const [showType, setShowType] = useState(0);
  const [fullOpen, setFullOpen] = useState(false);
  const { tokens }: any = useContext(DashboardContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  const { viewType, setViewType }: any = useContext(SwapContext);

  useEffect(() => {
    if (window.innerHeight < 820) setItemsPerPage(Math.min(Math.floor((window.innerHeight - 297) / 50), 7));
    else if (window.innerHeight < 890) setItemsPerPage(Math.min(Math.floor((window.innerHeight - 586) / 50), 7));
    else setItemsPerPage(Math.min(Math.floor((window.innerHeight - 650) / 50), 7));
  }, [fullOpen]);

  useEffect(() => {
    let filteredTokens: any = [];
    if (listType === 0) {
      filteredTokens = tokens.filter((data: any) => !archives.includes(data.address));
    } else {
      filteredTokens = tokens.filter((data: any) => archives.includes(data.address));
    }
    setMaxPage(Math.ceil(filteredTokens.length / itemsPerPage));
  }, [listType, tokens, archives, itemsPerPage]);
  return (
    <>
      <StyledContainer className="relative mr-1.5 flex w-full  flex-col  pb-3">
        <div className="flex w-full justify-between border-b border-yellow pb-4">
          <div className="flex items-center ">
            <LogoIcon classNames="w-14 text-dark dark:text-brand" />
            <div className={"ml-5 text-2xl font-semibold text-yellow"}>Dashboard</div>
          </div>
          <NavButton value={viewType} setValue={setViewType} />
        </div>

        {viewType === 0 ? (
          <ChartPanel>
            <div className={"mt-7"}>
              <PerformanceChart tokens={tokens} showType={showType} />
            </div>
            <div className={"relative z-10 flex w-full justify-center"}>
              <SwitchButton value={showType} setValue={setShowType} />
            </div>{" "}
          </ChartPanel>
        ) : (
          ""
        )}
      </StyledContainer>
      {viewType === 1 ? (
        <div className="mt-4 flex justify-center">
          <SwapPanel type={"draw"} disableChainSelect />
        </div>
      ) : (
        <>
          <TokenList
            tokens={tokens}
            fullOpen={fullOpen}
            showType={showType}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            itemsPerPage={itemsPerPage}
            archives={archives}
            setArchives={setArchives}
            listType={listType}
            setListType={setListType}
          />
          <div className={"w-full"}>
            <FullOpenVector
              open={fullOpen}
              setOpen={setFullOpen}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              maxPage={maxPage}
            />
          </div>
        </>
      )}
      <PricePanel className={`absolute bottom-8 w-full px-4 ${fullOpen ? "hidden" : ""}`} viewType={viewType}>
        <PriceList />
      </PricePanel>
    </>
  );
};

export default UserDashboard;

const StyledContainer = styled.div`
  padding-top: 64px;

  @media screen and (max-height: 890px) {
    padding-top: 0px;
  }
`;

const ChartPanel = styled.div`
  @media screen and (max-height: 820px) {
    display: none;
  }
`;

const PricePanel = styled.div<{ viewType: number }>`
  @media screen and (max-height: 530px) {
    display: none;
  }
  display: ${({ viewType }) => (viewType === 1 ? "none" : "")};
`;

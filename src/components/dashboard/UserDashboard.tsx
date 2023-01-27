import { useContext, useEffect, useState } from "react";

import LogoIcon from "../LogoIcon";
import PerformanceChart from "./PerformanceChart";
import SwitchButton from "./SwitchButton";
import TokenList from "./TokenList";
import FullOpenVector from "./FullOpenVector";

import { DashboardContext } from "contexts/DashboardContext";

const UserDashboard = () => {
  const [showType, setShowType] = useState(0);
  const [fullOpen, setFullOpen] = useState(true);
  const { tokens }: any = useContext(DashboardContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    setItemsPerPage(Math.min(Math.floor((window.innerHeight - 650) / 50), 7));
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
      <div className="relative mr-1.5 flex w-full  flex-col  pt-16 pb-3">
        <div className="flex w-full items-center border-b border-yellow pb-4">
          <LogoIcon classNames="w-14 text-dark dark:text-brand" />
          <div className={"ml-5 text-2xl font-semibold text-yellow"}>Dashboard</div>
        </div>

        <div className={"mt-7"}>
          <PerformanceChart tokens={tokens} showType={showType} />
        </div>

        <div className={"relative z-10 flex w-full justify-center"}>
          <SwitchButton value={showType} setValue={setShowType} />
        </div>
      </div>
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

      <div className={"mb-3 w-full"}>
        <FullOpenVector
          open={fullOpen}
          setOpen={setFullOpen}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          maxPage={maxPage}
        />
      </div>
    </>
  );
};

export default UserDashboard;

import { BarsArrowUpIcon } from "@heroicons/react/24/outline";
import PoolCard from "./PoolCard";

const navigationItems = [
  {
    name: "Network",
    sortValue: "chainId",
  },
  {
    name: "Pool",
    sortValue: "default",
  },
  {
    name: "TVL",
    sortValue: "tvl",
  },
  {
    name: "Total supply staked",
    sortValue: "totalStaked",
  },
  {
    name: "Performance",
    sortValue: "apr",
  },
];

const PoolList = ({
  pools,
  setSelectPoolDetail,
  setCurPool,
  setSortOrder,
  loading,
}: {
  pools: any;
  setSelectPoolDetail: any;
  setCurPool: any;
  setSortOrder: any;
  loading: boolean;
}) => {
  return (
    <div>
      <div className="sticky top-0 z-10 mb-4 hidden justify-between rounded-t-lg bg-zinc-900/90 px-4 py-4 backdrop:blur md:flex">
        {navigationItems.map((item, i) => (
          <button
            key={i}
            className="group flex min-w-[80px] items-center gap-2 text-start"
            onClick={() => setSortOrder(item.sortValue)}
          >
            {item.name} <BarsArrowUpIcon className="h-auto w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <div>
        {!loading && <div className="mt-3 text-center">loading...</div>}
        {loading &&
          pools.map((data: any, i: number) => {
            return (
              <PoolCard
                data={data}
                key={i}
                index={i}
                setSelectPoolDetail={setSelectPoolDetail}
                setCurPool={setCurPool}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PoolList;

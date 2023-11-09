import TimeAgo from "javascript-time-ago";

// English.
import { Oval } from "react-loader-spinner";
import { useCallback, useEffect, useRef, useState } from "react";
import HolderCard from "./HolderCard";
import useTokenInfo from "@hooks/useTokenInfo";
import { usePools } from "state/pools/hooks";
import { ethers } from "ethers";

// Create formatter (English).

export default function HolderList({ histories, selectedPair, loading, setTB }) {
  const [filteredHistories, setFilteredHistories] = useState([]);

  const { deployer } = useTokenInfo(selectedPair.baseToken.address, selectedPair.chainId);
  const { pools } = usePools();

  const node: any = useRef();
  const stringifiedHistories = JSON.stringify(histories);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = node.current;
    if (scrollTop + clientHeight === scrollHeight && !loading && scrollHeight > 50) {
      console.log("reached bottom hook in scroll component");
      setTB(histories[0].timestamp + 1);
    } else {
    }
  }, [node, loading, stringifiedHistories]);

  useEffect(() => {
    if (node.current) {
      node.current.addEventListener("scroll", handleScroll);
      return () => node.current?.removeEventListener("scroll", handleScroll);
    }
  }, [node, handleScroll]);

  const stringifiedPools = JSON.stringify(pools);

  useEffect(() => {
    setFilteredHistories(
      histories
        .filter((history) => history.ownerShip)
        .map((history) => {
          const isExistingPool = pools.find((pool) => pool.contractAddress.toLowerCase() === history.address);

          return {
            ...history,
            type: isExistingPool ? "Staking Pool" : deployer.toLowerCase() === history.address ? "Deployer" : "Wallet",
          };
        })
        .sort((b, a) => a.balance - b.balance)
    );
  }, [stringifiedHistories, stringifiedPools, selectedPair.address, deployer]);

  return (
    <div className="mt-2 rounded-md p-1.5 text-sm">
      <div className="hidden justify-between rounded-[2px] bg-[#D9D9D91A] p-[4px_12px] text-[#FFFFFFBF] lg:flex">
        <div className="flex">
          <div className="w-[200px]">Holder</div>
          <div className="w-[160px]">Type</div>
        </div>
        <div className="flex">
          <div className="w-24 overflow-hidden text-ellipsis">{selectedPair.baseToken.symbol}</div>
          <div className="w-24">Ownership</div>
          <div className="w-20">USD</div>
        </div>
      </div>
      <div
        className="yellowScroll mt-2.5 max-h-[400px] w-[calc(100%+6px)] overflow-x-clip overflow-y-scroll"
        ref={node}
      >
        {filteredHistories.map((list, i) => {
          return <HolderCard key={i} list={list} i={i} selectedPair={selectedPair} />;
        })}

        {loading ? (
          <div className="flex w-full justify-center py-2">
            <Oval
              width={21}
              height={21}
              color={"white"}
              secondaryColor="black"
              strokeWidth={3}
              strokeWidthSecondary={3}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef, useState } from "react";
// import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { TRENDING_INFO, TrendingId } from "config/constants/trendingInfo";
import { CircleInfoSVG } from "@components/dashboard/assets/svgs";
import { Transition } from "framer-motion";
import styled from "styled-components";

const getTrendingNameIcon = (id) => {
    const { trendingName, logo } = TRENDING_INFO[id];
    return {trendingName, logo};
}

const TrendingSelector = () => {
  const [filter, setFilter] = useState(1);
  const [open, setOpen] = useState(false);
  const { trendingName, logo } = TRENDING_INFO[filter];

  const dropRef: any = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <div className="max-[480px]:w-full">
      <div className="flex items-center">
        <CircleInfoSVG size="10"/> 
        <p className="text-white flex items-center text-[9px] leading-[9px] max-[480px]:text-[10px] max-[480px]:leading-[12px]">What is trending heat map?</p>
      </div>
      <div className="flex p-0">
        <div className="min-w-[127px] flex max-[480px]:min-w-[300px]">
            <div onClick={() => setOpen(!open)} ref={dropRef} className="rounded-[8px] relative flex rounded-[120px] inline-block w-full text-left z-10 text-[12px] leading-[12px] font-[600] max-[480px]:text-[14px] max-[480px]:leading-[16px]">
                
                <div className="flex items-center inline-flex w-full items-center justify-between whitespace-nowrap rounded-[123px] bg-[#18181B] border-[0.5px] border-solid border-[#49494B] py-[5px] pl-2.5 pr-2.5 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:pr-3 text-white cursor-pointer">
                    <img src={logo} />
                    <p className="pl-0.5 pr-1">{trendingName}</p>
                    {!open ? 
                        <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" /> : 
                        <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />}
                </div>

                <div className={`absolute top-[40px] w-full rounded-b transition-all ${!open ? 'hidden': 'flex flex-col bg-[#313134]' }`}>
                    {[1, 2, 3, 4, 5].map((id, index) => {
                        return (
                            <div className="flex items-center" key={`trending${index}`}>
                                <button
                                    className={`group flex w-full items-center rounded-md px-2 py-2 text-[12px] leading-[14px] hover:bg-[#151924]`}
                                        onClick={() => setFilter(id)}
                                    >
                                    <img  src={getTrendingNameIcon(id).logo} className="mr-2"/>
                                    {getTrendingNameIcon(id).trendingName}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSelector;
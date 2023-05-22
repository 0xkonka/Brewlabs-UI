/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useState } from "react";
import styled from "styled-components";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TRENDING_INFO, TrendingId } from "config/constants/trendingInfo";
import { CircleInfoSVG } from "@components/dashboard/assets/svgs";

function Row({
  targetTrending,
  setFilter
}: {
  targetTrending: TrendingId,
  setFilter: (targetTrending: number) => void
}) {

  const { trendingName, logo } = TRENDING_INFO[targetTrending]

  const rowContent = (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-gray-400/20 text-white" : ""
          } group flex w-full items-center rounded-md px-2 py-2 font-[10px] leading-[12px]`}
          onClick={() => setFilter(targetTrending)}
        >
          <img src={logo} className="mr-2"/>
          {trendingName}
        </button>
      )}
    </Menu.Item>
  )

  return rowContent
}

const TrendingSelector = () => {
  const [filter, setFilter] = useState(1);
  const { trendingName, logo } = TRENDING_INFO[filter]

  return (
    <div className="max-[480px]:w-full">
      <div className="text-white text-xs flex items-center text-[6px] leading-[6px] max-[480px]:text-[10px] max-[480px]:leading-[12px]">
        <CircleInfoSVG size="10"/> 
        What is trending heat map?
      </div>
      <div className="flex p-0">
        <div className="min-w-[107px] flex max-[480px]:min-w-[300px]">
          <Menu as="div" className="relative inline-block w-full text-left z-[100] text-[10px] leading-[12px] font-[600] max-[480px]:text-[14px] max-[480px]:leading-[16px]">
            <div>
              <Menu.Button className="inline-flex w-full items-center justify-between whitespace-nowrap rounded-[123px] bg-[#18181B] border-[0.5px] border-solid border-[#49494B] py-[5px] pl-2.5 pr-2.5 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 sm:pr-3 text-white">
                <img src={logo} />
                <p className="pl-0.5 pr-1">{trendingName}</p>
                <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute mt-2 w-56 divide-y divide-gray-100 rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-0">
                <div className="px-1 py-1 ">
                  {[1, 2, 3, 4, 5].map((id, index) => (
                    <Row targetTrending = {id as TrendingId} setFilter={setFilter} />
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TrendingSelector;

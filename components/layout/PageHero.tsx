import React, { ReactNode } from "react";
import PhoneFrame from "@components/PhoneFrame";

import { PlayCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const PageHero = () => (
  <div className="relative flex flex-col justify-center bg-gradient-to-bl from-slate-300 to-gray-200 pt-10 md:justify-end lg:overflow-hidden">
    <div className="mx-20 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
      <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none xl:col-span-6">
        <header className="mt-4 mb-4 font-brand text-dark sm:mt-5 lg:mt-6">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl">
            Get ready for the next generation in blockchain utilities
          </h1>
        </header>

        <p className="max-w-sm text-base text-dark dark:text-dark">
          Brewlabs Earn is where you can build your future. We have a unique set of tools and utilities to build your
          portfolio.
        </p>

        <div className="mt-4">
          <div className="flex gap-2">
            <button className="btn-outline btn-primary btn">
              <ChatBubbleLeftRightIcon className="mr-1 h-6 w-6" />
              Join our community
            </button>
            <button className="btn-outline btn">
              <PlayCircleIcon className="mr-1 h-6 w-6" />
              Watch the video
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
        <div className="-mx-4 h-[448px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-10 lg:-bottom-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
          <PhoneFrame className="mx-auto max-w-[366px]" priority>
            <div className="flex items-center justify-center">Content is coming.</div>
          </PhoneFrame>
        </div>
      </div>
    </div>

    <div className="waves relative h-16">
      <svg
        className="absolute bottom-0 h-8 w-full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28 "
        preserveAspectRatio="none"
      >
        <defs>
          <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>

        <g className="wave3">
          <use xlinkHref="#wave-path" x="50" y="9" className="fill-slate-50 dark:fill-slate-800" />
        </g>
      </svg>
    </div>
  </div>
);

export default PageHero;

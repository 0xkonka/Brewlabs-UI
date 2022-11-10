import React, { ReactNode } from "react";
import VideoBackground from "../VideoBackground";

import styles from "./PageHero.module.scss";

const PageHero = ({
  pageTitle,
  pageIntro,
  videoBgPath,
  children,
}: {
  pageTitle: string;
  pageIntro: string;
  videoBgPath?: string;
  children?: ReactNode;
}) => (
  <div
    id={styles.hero}
    className="relative flex flex-col justify-center bg-gradient-to-bl from-amber-300 to-yellow-500 pt-20 md:justify-end lg:overflow-hidden"
  >
    <div className="mx-auto w-full max-w-7xl px-4 text-left font-brand sm:px-8">
      <div id="brand" className="relative py-8">
        <header className="mt-4 mb-4 font-brand text-dark sm:mt-5 lg:mt-6">
          <h1 className="text-3xl uppercase sm:text-4xl lg:text-6xl">{pageTitle}</h1>
          <h3 className="ml-1 font-bold tracking-widest">BY BREWLABS</h3>
        </header>

        <p>{pageIntro}</p>

        {children}
      </div>
    </div>
    {videoBgPath !== undefined && <VideoBackground path={videoBgPath} />}
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

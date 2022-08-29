import React, { ReactNode } from "react";
import styles from "./PageHero.module.scss";
import VideoBackground from "./VideoBackground";

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
    className="flex flex-col md:justify-end justify-center pt-20 bg-gradient-to-bl from-amber-300 to-yellow-500 lg:overflow-hidden relative"
  >
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 text-left font-brand">
      <div id="brand" className="py-8 relative">
        <header className="mt-4 sm:mt-5 lg:mt-6 font-brand text-dark mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl uppercase">
            {pageTitle}
          </h1>
          <h3 className="font-bold ml-1 tracking-widest">BY BREWLABS</h3>
        </header>

        <p>{pageIntro}</p>

        {children}
      </div>
    </div>
    {videoBgPath !== undefined && <VideoBackground path={videoBgPath} />}
    <div className="waves h-16 relative">
      <svg
        className="w-full absolute h-8 bottom-0"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28 "
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave-path"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>

        <g className="wave3">
          <use
            xlinkHref="#wave-path"
            x="50"
            y="9"
            className="fill-slate-50 dark:fill-slate-800"
          />
        </g>
      </svg>
    </div>
  </div>
);

export default PageHero;

import { ReactNode } from "react";
import Head from "next/head";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { ChainId } from "@brewlabs/sdk";

import { motion } from "framer-motion";

import { DEFAULT_META, getCustomMeta } from "config/constants/meta";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useBrewsCoingeckoPrice, useBrewsUsdPrice } from "hooks/useUsdPrice";
import Bubbles from "../animations/Bubbles";

export const PageMeta: React.FC = () => {
  const { pathname } = useRouter();
  const { chainId } = useActiveChainId();
  const brewsPriceCoingecko = useBrewsCoingeckoPrice();
  const brewsPriceUsd = useBrewsUsdPrice();

  let brewsPriceUsdDisplay = brewsPriceUsd ? `$${brewsPriceUsd.toFixed(4)}` : '...'
  if(chainId !== ChainId.BSC_MAINNET || !brewsPriceUsd) {
    brewsPriceUsdDisplay = brewsPriceCoingecko ? `$${brewsPriceCoingecko.toFixed(4)}` : '...'
  }

  const pageMeta = getCustomMeta(pathname) || {};
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta };
  let pageTitle = brewsPriceUsdDisplay ? [title, brewsPriceUsdDisplay].join(' | ') : title

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
};

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const variants = {
    hidden: {
      opacity: 0,
      x: 0,
      y: 500,
      scale: 1.1,
    },
    enter: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: 0,
      y: -500,
      scale: 0.95,
    },
  };

  const variantsHome = {
    hidden: { opacity: 0, x: 0, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: 0 },
  };

  return (
    <>
      <PageMeta />
      <motion.div
        id="page_wrapper"
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={router.pathname === "/" ? variantsHome : variants}
        className="relative z-0 flex-1 focus:outline-none xl:order-last"
      >
        <Bubbles />

        <Image
          className="fixed top-0 -right-44 opacity-50"
          src="./images/blur-indigo.png"
          alt=""
          width={567}
          height={567}
          unoptimized
          priority
        />
        {children}
      </motion.div>
    </>
  );
};

export default PageWrapper;

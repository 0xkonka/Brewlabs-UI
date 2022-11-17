import { ReactNode } from "react";
import Head from "next/head";

import { useRouter } from "next/router";
import { ChainId } from "@brewlabs/sdk";

import { motion } from "framer-motion";

import { DEFAULT_META, getCustomMeta } from "config/constants/meta";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useBrewsCoingeckoPrice, useBrewsUsdPrice } from "hooks/useUsdPrice";

export const PageMeta: React.FC = () => {
  const { pathname } = useRouter();
  const { chainId } = useActiveChainId();
  const brewsPriceCoingecko = useBrewsCoingeckoPrice();
  const brewsPriceUsd = useBrewsUsdPrice();

  let brewsPriceUsdDisplay = brewsPriceUsd ? `$${brewsPriceUsd.toFixed(4)}` : "...";
  if (chainId !== ChainId.BSC_MAINNET || !brewsPriceUsd) {
    brewsPriceUsdDisplay = brewsPriceCoingecko ? `$${brewsPriceCoingecko.toFixed(4)}` : "...";
  }

  const pageMeta = getCustomMeta(pathname) || {};
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta };
  let pageTitle = brewsPriceUsdDisplay ? [title, brewsPriceUsdDisplay].join(" | ") : title;

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
      y: 500,
      transition: {
        y: { duration: 0.5 },
        default: { ease: [0.6, -0.05, 0.01, 0.99] },
      },
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        y: { duration: 0.5 },
        default: { ease: [0.6, -0.05, 0.01, 0.99] },
      },
    },
    exit: {
      opacity: 0.25,
      y: -500,
      transition: {
        y: { duration: 0.75 },
        default: { ease: [0.6, -0.05, 0.01, 0.99] },
      },
    },
  };

  const variantsHome = {
    hidden: { opacity: 0, y: 0 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
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
        onAnimationStart={() => document.body.classList.add("overflow-hidden")}
        onAnimationComplete={() => document.body.classList.remove("overflow-hidden")}
        className="relative z-0 min-h-screen w-full flex-1 overflow-x-hidden xl:order-last"
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageWrapper;

import { ReactNode } from "react";
import Image from "next/future/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Bubbles from "../animations/Bubbles";

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
  );
};

export default PageWrapper;

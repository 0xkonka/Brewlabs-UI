import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const variants = {
    hidden: { opacity: 0, x: 0, y: 500 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -500 },
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
      transition={{ type: "linear" }}
      variants={router.pathname === "/" ? variantsHome : variants}
      className="flex-1 relative z-0 focus:outline-none xl:order-last"
    >
      <div className="h-full">{children}</div>
    </motion.div>
  );
};

export default PageWrapper;

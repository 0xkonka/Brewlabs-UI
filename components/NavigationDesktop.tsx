import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import clsx from "clsx";
import Navigation from "./Navigation";

const NavigationDesktop = () => {
  const [slimVersion, setSlimVersion] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/") {
      setSlimVersion(true);
    } else {
      setSlimVersion(false);
    }
  }, [router.pathname]);

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 h-screen sticky top-0">
      <motion.div
        layout
        transition={spring}
        className={clsx(
          "flex flex-col",
          slimVersion ? "w-14 overflow-hidden" : "w-64"
        )}
      >
        <Navigation slim={slimVersion} />
      </motion.div>
    </div>
  );
};

export default NavigationDesktop;

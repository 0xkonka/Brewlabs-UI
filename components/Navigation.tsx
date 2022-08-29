import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import LogoIcon from "./LogoIcon";
import ConnectWallet from "./ConnectWallet";
import ThemeSwitcher from "./ThemeSwitcher";
import DynamicHeroIcon, { IconName } from "./DynamicHeroIcon";

import { navigationData } from "../data/navigation";

const Navigation = ({ slim }: { slim?: boolean }) => {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100 dark:bg-zinc-900 dark:border-gray-800 overflow-x-hidden">
      <div className="flex-1 flex flex-col pt-5 pb-4">
        <div className="flex items-center flex-shrink-0 px-4">
          <LogoIcon classNames="w-12 text-dark dark:text-brand" />
        </div>
        <nav className="mt-5 flex-1" aria-label="Sidebar">
          <div className="px-2 space-y-1 font-brand tracking-wider">
            {navigationData.map((item) => (
              <Link href={item.href} passHref key={item.name}>
                <motion.a
                  layout="position"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className={clsx(
                    item.href === router.pathname
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <DynamicHeroIcon
                    icon={item.icon as IconName}
                    className={clsx(
                      item.href === router.pathname
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-600 dark:text-gray-500 group-hover:text-gray-500",
                      slim ? "h-5 w-5" : "h-6 w-6 mr-3"
                    )}
                  />

                  <span className={clsx(slim && "sr-only")}>{item.name}</span>
                </motion.a>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {!slim && <ThemeSwitcher />}
      {!slim && <ConnectWallet />}
    </div>
  );
};

export default Navigation;

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import LogoIcon from "../LogoIcon";
import ConnectWallet from "../ConnectWallet";
import ThemeSwitcher from "../ThemeSwitcher";
import DynamicHeroIcon, { IconName } from "../DynamicHeroIcon";
import { setGlobalState } from "../../state";
import { navigationData } from "../../data/navigation";

const Navigation = ({ slim }: { slim?: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    // Close the mobile navigation when navigating
    router.events.on("routeChangeStart", () =>
      setGlobalState("mobileNavOpen", false)
    );
  }, [router.events]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden border-r border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-zinc-900">
      <div className="flex flex-1 flex-col pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <LogoIcon classNames="w-12 text-dark dark:text-brand" />
        </div>
        <nav className="mt-5 flex-1" aria-label="Sidebar">
          <div className="space-y-1 px-2 font-brand tracking-wider">
            {navigationData.map((item) => (
              <Link href={item.href} passHref key={item.name}>
                <motion.a
                  layout="position"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className={clsx(
                    item.href === router.pathname
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                  )}
                >
                  <DynamicHeroIcon
                    icon={item.icon as IconName}
                    className={clsx(
                      item.href === router.pathname
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-600 group-hover:text-gray-500 dark:text-gray-500",
                      slim ? "h-5 w-5" : "mr-3 h-6 w-6"
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

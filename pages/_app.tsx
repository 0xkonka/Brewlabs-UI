import clsx from "clsx";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { WagmiProvider } from 'contexts/wagmi'
import { client } from 'utils/wagmi'

import "../styles/globals.css";
import "../styles/animations.scss";

import UserSidebar from "../components/UserSidebar";
import HeaderMobile from "../components/navigation/HeaderMobile";
import NavigationDesktop from "../components/navigation/NavigationDesktop";
import NavigationMobile from "../components/navigation/NavigationMobile";

// TODO: Better name MyApp
// TODO: See if some markup can be reduced
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WagmiProvider client={client}>
        <div
          className={clsx(
            router?.pathname === "/" && "home",
            "relative min-h-screen bg-gradient-to-b from-white to-gray-200 dark:bg-gradient-to-tr dark:from-slate-800 dark:via-slate-800  dark:to-slate-900"
          )}
        >
          <div className="flex h-full">
            <NavigationDesktop />

            <NavigationMobile />

            <UserSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
              <HeaderMobile />

              <LazyMotion features={domAnimation}>
                <AnimatePresence exitBeforeEnter>
                  <Component {...pageProps} key={router.pathname} />
                </AnimatePresence>
              </LazyMotion>
            </div>
          </div>
        </div>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default MyApp;

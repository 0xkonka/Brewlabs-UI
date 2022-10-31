import "../styles/globals.css";
import "../styles/animations.scss";
import clsx from "clsx";
import { getDefaultProvider } from "ethers";
import { WagmiConfig, createClient } from "wagmi";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import UserSidebar from "../components/UserSidebar";
import HeaderMobile from "../components/navigation/HeaderMobile";
import NavigationDesktop from "../components/navigation/NavigationDesktop";
import NavigationMobile from "../components/navigation/NavigationMobile";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

// TODO: Better name MyApp
// TODO: See if some markup can be reduced
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      <WagmiConfig client={client}>
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
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;

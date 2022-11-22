import { lazy, Suspense } from "react";
import clsx from "clsx";
import Image from "next/future/image";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";

import "react-toastify/dist/ReactToastify.css";

import UserSidebar from "../components/dashboard/UserSidebar";
import HeaderMobile from "../components/navigation/HeaderMobile";
import NavigationDesktop from "../components/navigation/NavigationDesktop";
import NavigationMobile from "../components/navigation/NavigationMobile";

import { WagmiProvider } from "contexts/wagmi";
import { TokenPriceContextProvider } from "contexts/TokenPriceContext";
import { persistor, useStore } from "state";
import { usePollBlockNumber } from "state/block/hooks";
import { client } from "utils/wagmi";

import "animate.css";
import "../styles/globals.css";
import "../styles/animations.scss";

import { useAccountEventListener } from "hooks/useAccountEventListener";

const Bubbles = lazy(() => import("../components/animations/Bubbles"));

function GlobalHooks() {
  usePollBlockNumber();
  useAccountEventListener();
  return null;
}

// TODO: Better name MyApp
function MyApp({ Component, pageProps }: AppProps<{ initialReduxState: any }>) {
  const router = useRouter();
  const store = useStore(pageProps.initialReduxState);

  return (
    <WagmiProvider client={client}>
      <Provider store={store}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <TokenPriceContextProvider>
            <SWRConfig>
              <GlobalHooks />
              <PersistGate loading={null} persistor={persistor}>
                <div
                  className={clsx(
                    router?.pathname === "/" && "home",
                    "relative min-h-screen bg-gray-100 dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-800  dark:to-slate-900"
                  )}
                >
                  <Suspense>
                    <Bubbles />
                  </Suspense>
                  {/* 
                  <Image
                    className="fixed top-0 -right-44 dark:opacity-50"
                    src="/images/blur-indigo.png"
                    alt="background blur"
                    width={567}
                    height={567}
                    unoptimized={false}
                  /> */}

                  <div className="flex h-full">
                    <NavigationDesktop />
                    <NavigationMobile />
                    <UserSidebar />

                    <div className="flex flex-1 flex-col">
                      <HeaderMobile />

                      <LazyMotion features={domAnimation}>
                        <AnimatePresence exitBeforeEnter>
                          <Component {...pageProps} key={router.pathname} />
                        </AnimatePresence>
                      </LazyMotion>
                    </div>

                    <ToastContainer />
                  </div>
                </div>
              </PersistGate>
            </SWRConfig>
          </TokenPriceContextProvider>
        </ThemeProvider>
      </Provider>
    </WagmiProvider>
  );
}

export default MyApp;

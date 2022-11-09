import clsx from "clsx";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";

import { WagmiProvider } from "contexts/wagmi";
import { persistor, useStore } from "state";
import { usePollBlockNumber } from "state/block/hooks";
import { client } from "utils/wagmi";

import "../styles/globals.css";
import "../styles/animations.scss";

import UserSidebar from "../components/UserSidebar";
import HeaderMobile from "../components/navigation/HeaderMobile";
import NavigationDesktop from "../components/navigation/NavigationDesktop";
import NavigationMobile from "../components/navigation/NavigationMobile";

// TODO: Better name MyApp
// TODO: See if some markup can be reduced
function MyApp({ Component, pageProps }: AppProps<{ initialReduxState: any }>) {
  const router = useRouter();
  const store = useStore(pageProps.initialReduxState);

  usePollBlockNumber()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WagmiProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SWRConfig>
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
            </SWRConfig>
          </PersistGate>
        </Provider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default MyApp;

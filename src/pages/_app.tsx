import { Fragment, lazy, Suspense, useEffect } from "react";
import clsx from "clsx";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import Image from "next/image";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

import { BridgeProvider } from "contexts/BridgeContext";
import { WagmiProvider } from "contexts/wagmi";
import { TokenPriceContextProvider } from "contexts/TokenPriceContext";
import { SwapContextProvider } from "contexts/SwapContext";
import { DashboardContextProvider } from "contexts/DashboardContext";
import { IndexContextProvider } from "contexts/directory/IndexContext";
import { ZapperContextProvider } from "contexts/directory/ZapperContext";
import { LanguageProvider } from "contexts/localization";
import { useAccountEventListener } from "hooks/useAccountEventListener";
import { persistor, useStore } from "state";
import { usePollBlockNumber } from "state/block/hooks";
import { client } from "utils/wagmi";

import "animate.css";
import "../styles/globals.css";
import "../styles/animations.scss";
import "../styles/Toast.custom.scss";
import SEO from "../../next-seo.config.mjs";

import UserSidebar from "components/dashboard/UserSidebar";
import HeaderMobile from "components/navigation/HeaderMobile";
import NavigationDesktop from "components/navigation/NavigationDesktop";
import NavigationMobile from "components/navigation/NavigationMobile";
import { Updaters } from "../index";
import { usePollFarmsPublicDataFromApi, usePollFarmsWithUserData } from "state/farms/hooks";
import { useFetchPoolsWithUserData, useFetchPublicPoolsData, usePollPoolsPublicDataFromApi } from "state/pools/hooks";

const Bubbles = lazy(() => import("components/animations/Bubbles"));

function GlobalHooks() {
  usePollBlockNumber();
  useAccountEventListener();

  usePollFarmsPublicDataFromApi();
  usePollPoolsPublicDataFromApi();

  usePollFarmsWithUserData();
  useFetchPublicPoolsData();
  useFetchPoolsWithUserData();

  return null;
}

// TODO: Better name MyApp
function MyApp(props: AppProps<{ initialReduxState: any }>) {
  const { pageProps } = props;
  const store = useStore(pageProps.initialReduxState);

  const router = useRouter();

  useEffect(() => {
    const handler = (page: any) => {
      window.dataLayer.push({
        event: "pageview",
        page,
      });
    };
    router.events.on("routeChangeComplete", handler);
    router.events.on("hashChangeComplete", handler);
    return () => {
      router.events.off("routeChangeComplete", handler);
      router.events.off("hashChangeComplete", handler);
    };
  }, [router.events]);

  return (
    <>
      <WagmiProvider client={client}>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <TokenPriceContextProvider>
              <DashboardContextProvider>
                <SwapContextProvider>
                  <IndexContextProvider>
                    <ZapperContextProvider>
                      <LanguageProvider>
                        <BridgeProvider>
                          <SWRConfig>
                            <GlobalHooks />
                            <PersistGate loading={null} persistor={persistor}>
                              <DefaultSeo {...SEO} />
                              <Updaters />

                              <div
                                className={clsx(
                                  router?.pathname === "/" && "home",
                                  "relative min-h-screen bg-gray-100 dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
                                )}
                              >
                                <Suspense>
                                  <Bubbles />
                                </Suspense>

                                {/* <Image
                                  className="fixed top-0 -right-44 home:z-10 dark:opacity-50"
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
                                        <App {...props} />
                                      </AnimatePresence>
                                    </LazyMotion>
                                  </div>
                                </div>
                                <ToastContainer />
                              </div>
                            </PersistGate>
                          </SWRConfig>
                        </BridgeProvider>
                      </LanguageProvider>
                    </ZapperContextProvider>
                  </IndexContextProvider>
                </SwapContextProvider>
              </DashboardContextProvider>
            </TokenPriceContextProvider>
          </ThemeProvider>
        </Provider>
      </WagmiProvider>

      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-4YPVGE70E1`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4YPVGE70E1', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />
    </>
  );
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>;
  /** render component without all layouts */
  pure?: true;
  /**
   * allow chain per page, empty array bypass chain block modal
   * @default [ChainId.BSC]
   * */
  chains?: number[];
  isShowScrollToTopButton?: true;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />;
  }

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment;
  const isShowScrollToTopButton = Component.isShowScrollToTopButton || true;

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* <NetworkModal pageSupportedChains={Component.chains} /> */}
    </>
  );
};

export default MyApp;

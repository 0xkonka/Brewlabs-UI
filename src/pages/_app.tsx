import { Fragment, lazy, Suspense, useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import { WagmiConfig } from "wagmi";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-multi-carousel/lib/styles.css";
import "react-tooltip/dist/react-tooltip.css";

import "animate.css";
import "../styles/globals.css";
import "../styles/animations.scss";
import "../styles/Toast.custom.scss";
import SEO from "../../next-seo.config.mjs";

import UserSidebar from "components/dashboard/UserSidebar";
import HeaderMobile from "components/navigation/HeaderMobile";
import NavigationDesktop from "components/navigation/NavigationDesktop";
import NavigationMobile from "components/navigation/NavigationMobile";

import { BridgeProvider } from "contexts/BridgeContext";
import { ChartContextProvider } from "contexts/ChartContext";
import { CommunityContextProvider } from "contexts/CommunityContext";
import { UserContextProvider } from "contexts/UserContext";
import { DashboardContextProvider } from "contexts/DashboardContext";
import { LanguageProvider } from "contexts/localization";
import { SwapContextProvider } from "contexts/SwapContext";
import { TokenPriceContextProvider } from "contexts/TokenPriceContext";

import { useAccountEventListener } from "hooks/useAccountEventListener";
import { persistor, useStore } from "state";
import { usePollBlockNumber } from "state/block/hooks";
import { usePollFarmFactoryData, usePollIndexFactoryData } from "state/deploy/hooks";
import { usePollFarmsPublicDataFromApi, usePollFarmsWithUserData } from "state/farms/hooks";
import { useFetchIndexesWithUserData, useFetchPublicIndexesData, usePollIndexesFromApi } from "state/indexes/hooks";
import { useFetchNftUserData, useFetchPublicNftData } from "state/nfts/hooks";
import { useFetchPoolsWithUserData, useFetchPublicPoolsData, usePollPoolsPublicDataFromApi } from "state/pools/hooks";
import { useFetchMarketData } from "state/prices/hooks";
import { useFetchTokenBalance } from "state/wallet/hooks";
import { wagmiConfig } from "utils/wagmi";

import { Updaters } from "../index";

TimeAgo.addDefaultLocale(en);
const Bubbles = lazy(() => import("components/animations/Bubbles"));

function GlobalHooks() {
  usePollBlockNumber();
  useAccountEventListener();

  usePollFarmsPublicDataFromApi();
  usePollPoolsPublicDataFromApi();

  usePollFarmsWithUserData();
  useFetchPublicPoolsData();
  useFetchPoolsWithUserData();

  usePollIndexesFromApi();
  useFetchPublicIndexesData();
  useFetchIndexesWithUserData();

  usePollFarmFactoryData();
  usePollIndexFactoryData();

  useFetchPublicNftData();
  useFetchNftUserData();

  useFetchMarketData();

  useFetchTokenBalance();
  return null;
}

// TODO: Better name MyApp
function MyApp(props: AppProps<{ initialReduxState: any }>) {
  const { pageProps } = props;
  const store = useStore(pageProps.initialReduxState);

  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [navigationWidth, setNavigationWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));
    return () => {
      router.events.off("routeChangeStart", () => setLoading(true));
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  }, [router.events]);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <TokenPriceContextProvider>
              <UserContextProvider>
                <DashboardContextProvider>
                  <SwapContextProvider>
                    <ChartContextProvider>
                      <CommunityContextProvider>
                        <LanguageProvider>
                          <BridgeProvider>
                            <SWRConfig>
                              {mounted && <GlobalHooks />}
                              <PersistGate loading={null} persistor={persistor}>
                                <DefaultSeo {...SEO} />
                                <Updaters />

                                <div
                                  className={clsx(
                                    router?.pathname === "/" && "home",
                                    "relative min-h-screen bg-gray-100 dark:bg-zinc-900"
                                  )}
                                >
                                  <Suspense>
                                    <Bubbles />
                                  </Suspense>

                                  <img
                                    className="fixed -right-44 top-0 hidden home:z-10 dark:opacity-50 sm:block"
                                    src="/images/blur-indigo.png"
                                    alt=""
                                    width={567}
                                    height={567}
                                  />

                                  <div className="relative z-10 flex h-full">
                                    <NavigationDesktop />
                                    <NavigationMobile />
                                    <UserSidebar />

                                    <div className="relative flex flex-1 flex-col overflow-hidden">
                                      <HeaderMobile />
                                      <LazyMotion features={domAnimation}>
                                        <AnimatePresence exitBeforeEnter>
                                          <App {...props} />
                                        </AnimatePresence>
                                      </LazyMotion>
                                      {/* {loading ? <LoadingPage /> : ""} */}
                                    </div>
                                  </div>
                                  <ToastContainer />
                                </div>
                              </PersistGate>
                            </SWRConfig>
                          </BridgeProvider>
                        </LanguageProvider>
                      </CommunityContextProvider>
                    </ChartContextProvider>
                  </SwapContextProvider>
                </DashboardContextProvider>
              </UserContextProvider>
            </TokenPriceContextProvider>
          </ThemeProvider>
        </Provider>
      </WagmiConfig>

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
      <Script
        type="text/javascript"
        src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"
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

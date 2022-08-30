import "../styles/globals.css";
import { getDefaultProvider } from "ethers";
import { WagmiConfig, createClient } from "wagmi";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import type { AppProps } from "next/app";
import UserSidebar from "../components/UserSidebar";
import HeaderMobile from "../components/HeaderMobile";
import NavigationDesktop from "../components/NavigationDesktop";
import NavigationMobile from "../components/NavigationMobile";

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

// TODO: Better name MyApp
// TODO: See if some markup can be reduced
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <WagmiConfig client={client}>
        <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-200 dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-800  dark:to-zinc-900">
          <div className="h-full flex">
            <NavigationDesktop />

            <NavigationMobile />

            <UserSidebar />

            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
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

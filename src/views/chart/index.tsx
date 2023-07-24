import PageWrapper from "components/layout/PageWrapper";
import Header from "./components/Header";
import TokenInfo from "./components/TokenInfo";
import { useState } from "react";
import { tokens } from "config/constants/tokens";
import TradingPanel from "./components/TradingPanel";

export default function Chart() {
  const [selectedCurrency, setSelectedCurrency] = useState({
    token0: tokens[1].brews,
    token1: tokens[1].weth,
    chainId: 1,
  });
  return (
    <PageWrapper>
      {/* <PageHeader
        fullWidth={true}
        title={
          <Header1 />
        }
      /> */}
      <div className="px-6 font-brand pb-[100px]">
        <div className="mx-auto w-full max-w-[1560px]">
          <Header />
          <TokenInfo currency={selectedCurrency} />
          <TradingPanel currency={selectedCurrency} />
        </div>
      </div>
    </PageWrapper>
  );
}

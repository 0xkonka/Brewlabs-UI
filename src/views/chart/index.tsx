import PageWrapper from "components/layout/PageWrapper";
import Header from "./components/Header";
import TokenInfo from "./components/TokenInfo";
import { useContext, useEffect, useState } from "react";
import TradingPanel from "./components/TradingPanel";
import { useTokenMarketInfos } from "@hooks/useTokenInfo";
import { useDerivedSwapInfo, useSwapActionHandlers } from "state/swap/hooks";
import { Field } from "state/swap/actions";
import { NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { ChartContext } from "contexts/ChartContext";

export default function Chart() {
  const [selectedCurrency, setSelectedCurrency] = useState({
    tokenAddresses: ["0xdad33e12e61dc2f2692f2c12e6303b5ade7277ba", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    symbols: ["BREWLABS", "WETH"],
    chainId: 1,
    address: "0xd8a8442013f071bb118c3c3e03f6d07576d85a53",
    verified: true,
    swap: "uniswap",
  });
  const [showReverse, setShowReverse] = useState(false);

  const { onCurrencySelection } = useSwapActionHandlers();
  const { currencies } = useDerivedSwapInfo();

  const stringifiedCurrency = JSON.stringify(selectedCurrency);

  function setTokens() {
    let token0: any;
    if (selectedCurrency.tokenAddresses[0] === WNATIVE[selectedCurrency.chainId].address.toLowerCase())
      token0 = NATIVE_CURRENCIES[selectedCurrency.chainId];
    else
      token0 = new Token(selectedCurrency.chainId, selectedCurrency.tokenAddresses[0], 18, selectedCurrency.symbols[0]);
    onCurrencySelection(Field.OUTPUT, token0);

    let token1: any;
    if (selectedCurrency.tokenAddresses[1] === WNATIVE[selectedCurrency.chainId].address.toLowerCase())
      token1 = NATIVE_CURRENCIES[selectedCurrency.chainId];
    else
      token1 = new Token(selectedCurrency.chainId, selectedCurrency.tokenAddresses[1], 18, selectedCurrency.symbols[1]);
    onCurrencySelection(Field.INPUT, token1);
  }

  useEffect(() => {
    setTokens();
  }, [stringifiedCurrency]);

  useEffect(() => {
    setTimeout(() => {
      setTokens();
    }, 2000);
  }, []);

  const { infos: marketInfos }: any = useTokenMarketInfos(
    selectedCurrency.chainId,
    selectedCurrency.tokenAddresses[0],
    selectedCurrency.address
  );

  const { pending }: any = useContext(ChartContext);

  return (
    <PageWrapper>
      <div className={`px-3 pb-[100px] font-brand md:px-6 ${pending ? "opacity-50" : ""}`}>
        <div className="mx-auto w-full max-w-[1720px]">
          <div
            className={`mb-4 ${
              showReverse ? "ml-[296px] mr-[332px]" : "ml-[336px] mr-[292px]"
            } mt-10 hidden h-[120px] rounded-lg  bg-[url('/images/directory/truenft.png')] 2xl:block`}
          />
          <div className="mt-32 block 2xl:hidden" />
          <Header
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            setShowReverse={setShowReverse}
            showReverse={showReverse}
          />
          <TokenInfo currency={selectedCurrency} marketInfos={marketInfos} showReverse={showReverse} />
          <TradingPanel
            currency={selectedCurrency}
            marketInfos={marketInfos}
            setSelectedCurrency={setSelectedCurrency}
            showReverse={showReverse}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

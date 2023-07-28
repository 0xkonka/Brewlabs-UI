import PageWrapper from "components/layout/PageWrapper";
import Header from "./components/Header";
import TokenInfo from "./components/TokenInfo";
import { useEffect, useState } from "react";
import TradingPanel from "./components/TradingPanel";
import { useTokenMarketInfos } from "@hooks/useTokenInfo";
import { useDerivedSwapInfo, useSwapActionHandlers } from "state/swap/hooks";
import { Field } from "state/swap/actions";
import { NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";

export default function Chart() {
  const [selectedCurrency, setSelectedCurrency] = useState({
    tokenAddresses: ["0xdad33e12e61dc2f2692f2c12e6303b5ade7277ba", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    symbols: ["BREWLABS", "WETH"],
    chainId: 1,
    address: "0xd8a8442013f071bb118c3c3e03f6d07576d85a53",
    verified: true,
    swap: "uniswap",
  });

  const { onCurrencySelection } = useSwapActionHandlers();
  const { currencies } = useDerivedSwapInfo();

  const stringifiedCurrency = JSON.stringify(selectedCurrency);

  useEffect(() => {
    if (currencies[Field.INPUT]?.address?.toLowerCase() !== selectedCurrency.tokenAddresses[0]) {
      let token0: any;
      if (selectedCurrency.tokenAddresses[0] === WNATIVE[selectedCurrency.chainId].address.toLowerCase())
        token0 = NATIVE_CURRENCIES[selectedCurrency.chainId];
      else token0 = new Token(selectedCurrency.chainId, selectedCurrency.tokenAddresses[0], 18);
      onCurrencySelection(Field.INPUT, token0);
    }

    if (currencies[Field.OUTPUT]?.address?.toLowerCase() !== selectedCurrency.tokenAddresses[1]) {
      let token1: any;
      if (selectedCurrency.tokenAddresses[1] === WNATIVE[selectedCurrency.chainId].address.toLowerCase())
        token1 = NATIVE_CURRENCIES[selectedCurrency.chainId];
      else token1 = new Token(selectedCurrency.chainId, selectedCurrency.tokenAddresses[1], 18);
      onCurrencySelection(Field.OUTPUT, token1);
    }
  }, [stringifiedCurrency, currencies[Field.INPUT], currencies[Field.OUTPUT]]);

  const { infos: marketInfos }: any = useTokenMarketInfos(
    selectedCurrency.chainId,
    selectedCurrency.tokenAddresses[0],
    selectedCurrency.address
  );

  return (
    <PageWrapper>
      <div className="px-3 pb-[100px] font-brand md:px-6">
        <div className="mx-auto w-full max-w-[1560px]">
          <Header selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
          <TokenInfo currency={selectedCurrency} marketInfos={marketInfos} />
          <TradingPanel currency={selectedCurrency} marketInfos={marketInfos} />
        </div>
      </div>
    </PageWrapper>
  );
}

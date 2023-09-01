import PageWrapper from "components/layout/PageWrapper";
import Header from "./components/Header";
import TokenInfo from "./components/TokenInfo";
import { useContext, useEffect, useState } from "react";
import TradingPanel from "./components/TradingPanel";
import { useTokenMarketInfos } from "@hooks/useTokenInfo";
import { useSwapActionHandlers } from "state/swap/hooks";
import { Field } from "state/swap/actions";
import { NATIVE_CURRENCIES, Token, WNATIVE } from "@brewlabs/sdk";
import { ChartContext } from "contexts/ChartContext";
import Modal from "@components/Modal";
import SettingModal from "views/swap/components/modal/SettingModal";
import { SwapContext } from "contexts/SwapContext";
import { useUserSlippageTolerance } from "state/user/hooks";
import { Bars, Oval } from "react-loader-spinner";
import { fetchPairsAsync } from "state/chart";
import { useDispatch } from "react-redux";
import { usePairInfoByParams } from "state/chart/hooks";
import { isAddress } from "utils";

export default function Chart({ chain, address }) {
  const pairs: any = usePairInfoByParams({
    criteria: address,
    limit: 1,
    sort: "volume24h_stable",
    chain,
  });

  const selectedCurrency = pairs[0];
  const [showReverse, setShowReverse] = useState(true);

  const { onCurrencySelection } = useSwapActionHandlers();
  const dispatch: any = useDispatch();

  const stringifiedCurrency = JSON.stringify(selectedCurrency);

  function setTokens() {
    let token0: any;
    if (!selectedCurrency) return;
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
    if (!isAddress(address)) return;
    dispatch(fetchPairsAsync(address, 1, "volume24h_stable", chain));
  }, [chain, address]);

  const { infos: marketInfos }: any = useTokenMarketInfos(selectedCurrency);

  const { pending }: any = useContext(ChartContext);

  const {
    slippageInput,
    autoMode,
    slippage,
    setSlippageInput,
    setAutoMode,
    openSettingModal,
    setOpenSettingModal,
  }: any = useContext(SwapContext);
  const [, setUserSlippageTolerance] = useUserSlippageTolerance();

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value);
    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(valueAsIntFromRoundedFloat);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageWrapper>
      {openSettingModal && (
        <Modal
          open={openSettingModal}
          onClose={() => {
            setOpenSettingModal(false);
          }}
        >
          <SettingModal
            autoMode={autoMode}
            setAutoMode={setAutoMode}
            slippage={slippage}
            slippageInput={slippageInput}
            parseCustomSlippage={parseCustomSlippage}
          />
        </Modal>
      )}
      <div className={`px-3 pb-10 font-roboto md:px-6 ${pending ? "opacity-50" : ""}`}>
        {selectedCurrency ? (
          <div className="relative mx-auto mt-24 w-full max-w-[1720px] lg:mt-0">
            <Header setShowReverse={setShowReverse} showReverse={showReverse} />
            <TokenInfo currency={selectedCurrency} marketInfos={marketInfos} showReverse={showReverse} />
            <TradingPanel currency={selectedCurrency} marketInfos={marketInfos} showReverse={showReverse} />
          </div>
        ) : (
          <div className="flex h-screen w-full items-center justify-center">
            <Oval
              width={80}
              height={80}
              color={"#3F3F46"}
              secondaryColor="black"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

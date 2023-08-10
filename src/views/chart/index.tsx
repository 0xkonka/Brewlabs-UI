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
import { useWeb3React } from "contexts/wagmi";
import Modal from "@components/Modal";
import SettingModal from "views/swap/components/modal/SettingModal";
import { SwapContext } from "contexts/SwapContext";
import { useUserSlippageTolerance } from "state/user/hooks";

export default function Chart() {
  const [selectedCurrency, setSelectedCurrency] = useState({
    tokenAddresses: ["0x6aac56305825f712fd44599e59f2ede51d42c3e7", "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"],
    symbols: ["BREWLABS", "WBNB"],
    chainId: 56,
    address: "0xc9cc6515a1df94aaed156f3bd6efe86a100308fa",
    verified: true,
    swap: "pancakeswap",
  });
  const [showReverse, setShowReverse] = useState(true);

  const { onCurrencySelection } = useSwapActionHandlers();
  const { chainId } = useWeb3React();

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
  }, [chainId]);

  const { infos: marketInfos }: any = useTokenMarketInfos(
    selectedCurrency.chainId,
    selectedCurrency.tokenAddresses[0],
    selectedCurrency.address
  );

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
        <div className="relative mx-auto w-full max-w-[1720px]">
          <div
            className={`mb-2 mt-10 hidden h-[120px] rounded-lg  bg-[url('/images/directory/truenft.png')] bg-cover 2xl:block`}
          />
          <a
            href={"https://t.me/MaverickBL"}
            target={"_blank"}
            className="mb-2 flex w-full cursor-pointer justify-end font-brand text-xs !text-[#FFFFFF59] hover:!text-white"
          >
            Advertise with us
          </a>
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

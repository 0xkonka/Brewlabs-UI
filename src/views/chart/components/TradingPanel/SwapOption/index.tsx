import SwapPanel from "views/swap/SwapPanel";
import { useContext, useState } from "react";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import { BigNumberFormat, getExplorerLogo } from "utils/functions";
import TokenLogo from "@components/logo/TokenLogo";
import {
  CopySVG,
  FlagSVG,
  LockSVG,
  PlusSVG,
  TelegramSVG,
  WebSiteSVG,
  checkCircleSVG,
} from "@components/dashboard/assets/svgs";
import VolumeInfo from "./VolumeInfo";
import useTokenBalances from "@hooks/useTokenMultiChainBalance";
import { useAccount } from "wagmi";
import useTokenMarketChart from "@hooks/useTokenMarketChart";
import useTokenInfo from "@hooks/useTokenInfo";
import { addTokenToMetamask, getExplorerLink } from "lib/bridge/helpers";
import { BridgeToken } from "config/constants/types";
import { SwapContext } from "contexts/SwapContext";
import Modal from "@components/Modal";
import SettingModal from "views/swap/components/modal/SettingModal";
import { useUserSlippageTolerance } from "state/user/hooks";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SwapOption({ currency, marketInfos }) {
  const [isCopied, setIsCopied] = useState(false);

  const { address: account, connector } = useAccount();
  // const account = "0x330518cc95c92881bCaC1526185a514283A5584D";
  const { decimals } = useTokenInfo(currency.tokenAddresses[0], currency.chainId);

  const { balances } = useTokenBalances(
    { [currency.chainId]: [{ address: currency.tokenAddresses[0], decimals }] },
    { [currency.chainId]: [account] }
  );

  const prices = useTokenMarketChart(currency.chainId);

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

  const onCopyAddress = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(currency.tokenAddresses[0]);
  };

  const socials = [
    {
      icon: (
        <img
          src={getExplorerLogo(currency.chainId)}
          alt={""}
          className="h-[18px] w-[18px] rounded-full border border-white bg-white"
        />
      ),
      href: getExplorerLink(currency.chainId, "token", currency.tokenAddresses[0]),
    },
    { icon: LockSVG, isActive: false },
    { icon: checkCircleSVG, isActive: marketInfos?.audit?.codeVerified },
    { icon: WebSiteSVG, href: marketInfos?.links?.website ?? "#" },
    { icon: FlagSVG, href: marketInfos?.community ?? "#" },
    { icon: TelegramSVG, href: marketInfos?.links?.telegram ?? "#" },
    {
      icon: <img src={"/images/wallets/metamask.png"} alt={""} className="h-[18px] w-[18px] rounded-full" />,
      action: true,
    },
  ];

  function onAddToMetamask() {
    if (!marketInfos || !marketInfos.address) return;
    addTokenToMetamask(connector, {
      address: marketInfos.address,
      decimals: marketInfos.decimals,
      symbol: marketInfos.symbol,
    } as BridgeToken);
  }

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
    <div className="flex w-fit flex-col sm:w-full sm:flex-row 2xl:sm:flex-col">
      <div className="primary-shadow relative flex h-fit w-[320px] flex-col gap-1 rounded-[6px] bg-[#B9B8B80D] p-[34px_12px_12px_12px] 2xl:w-full">
        <div className="absolute right-3 top-2" onClick={() => setOpenSettingModal(true)}>
          <Cog8ToothIcon className="h-5 w-5 cursor-pointer hover:animate-spin dark:text-primary" />
        </div>
        <SwapPanel showHistory={false} size="sm" toChainId={currency.chainId} />
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
      </div>
      <div className="ml-0 mt-0 w-[320px] flex-1 sm:ml-4 sm:w-fit 2xl:sm:ml-0 2xl:mt-2 2xl:flex-none">
        {/* <SlippageInfo currency={currency} /> */}
        {/* <div className="mt-2" /> */}
        <VolumeInfo currency={currency} />
        <div className="primary-shadow mt-2 flex w-[320px] items-center justify-between rounded-[6px] bg-[#B9B8B80D] p-3">
          <div className="flex items-center">
            <TokenLogo
              src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
              classNames="primary-shadow h-8 w-8 rounded-full"
            />

            <div className="ml-2">
              <div className="text-sm leading-none text-white">
                {BigNumberFormat(balances && balances[currency.chainId] ? balances[currency.chainId][0].balance : 0)}{" "}
                {currency.symbols[0]} Balance
              </div>
              <div className="mt-0.5 text-xs leading-none text-[#FFFFFF80]">
                {balances && balances[currency.chainId]
                  ? BigNumberFormat(
                      balances[currency.chainId][0].balance *
                        (prices[currency.tokenAddresses[0].toLowerCase()]
                          ? prices[currency.tokenAddresses[0].toLowerCase()].usd
                          : 0)
                    )
                  : 0}{" "}
                USD
              </div>
            </div>
          </div>
          <div
            className={`cursor-pointer ${
              isCopied ? "!text-[#FFFFFFBF]" : "text-tailwind"
            } text-sm hover:text-white [&>svg]:!h-4 [&>svg]:!w-4`}
            onClick={() => onCopyAddress()}
          >
            {isCopied ? "Copied" : CopySVG}
          </div>
        </div>
        <div>
          <div className="primary-shadow mt-2 w-full rounded-[6px] bg-[#B9B8B80D] p-3 font-roboto text-[#FFFFFFBF]">
            <div className="mb-2 font-bold">Description</div>
            <div className="line-clamp-[7] overflow-hidden text-ellipsis text-xs">{marketInfos?.info?.description}</div>
            <div className="mb-2 mt-4 flex">
              {socials.map((social: any, i) => {
                if (social.href === "#") return;
                return (
                  <a
                    key={i}
                    className={`mr-1.5 cursor-pointer ${
                      social.href
                        ? "!text-tailwind hover:!text-white"
                        : social.isActive
                        ? "!text-green"
                        : "!text-tailwind"
                    } primary-shadow transition [&>svg]:!h-[18px] [&>svg]:!w-[18px]`}
                    target="_blank"
                    href={social.href}
                    onClick={() => social.action && onAddToMetamask()}
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex justify-end text-[#FFFFFFBF]">
            <a
              href={"https://t.me/MaverickBL"}
              className="mr-2.5 flex cursor-pointer items-center text-xs hover:text-white"
            >
              <div className="-mt-1 mr-1 text-tailwind">{PlusSVG}</div>
              <div>UPDATE DETAILS</div>
            </a>
            <Link href={"/communities"} className="flex cursor-pointer items-center text-xs hover:text-white">
              <div className="-mt-1 mr-1 text-tailwind">{PlusSVG}</div>
              <div>ADD COMMUNITY</div>
            </Link>
          </div>
        </div>
      </div>
      <div className={`mb-4 mt-4 hidden h-[120px] rounded-lg bg-[url('/images/directory/truenft.png')] 2xl:block`} />
    </div>
  );
}

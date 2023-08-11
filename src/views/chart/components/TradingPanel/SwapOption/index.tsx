import SwapPanel from "views/swap/SwapPanel";
import { useContext, useState } from "react";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { isAddress } from "utils";
import { BigNumberFormat, getExplorerLogo } from "utils/functions";
import TokenLogo from "@components/logo/TokenLogo";
import {
  ChevronDownSVG,
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
import { useDexPrice } from "@hooks/useTokenPrice";

export default function SwapOption({ currency, marketInfos }) {
  const [isCopied, setIsCopied] = useState(false);

  const { connector, address: account } = useAccount();
  // const account = "0xaE837FD1c51705F3f8f232910dfeCB9180541B27";
  const { decimals } = useTokenInfo(currency.tokenAddresses[0], currency.chainId);

  const { balances } = useTokenBalances(
    {
      [currency.chainId]: [
        { address: currency.tokenAddresses[0], decimals },
        { address: currency.address, decimals: 18 },
      ],
    },
    { [currency.chainId]: [account, account] }
  );

  const { price: lpPrice } = useDexPrice(currency.chainId, currency.address);
  const { price } = useDexPrice(currency.chainId, currency.tokenAddresses[0]);

  const { setOpenSettingModal }: any = useContext(SwapContext);

  const [switchBalance, setSwitchBalance] = useState(false);

  const onCopyAddress = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(switchBalance ? currency.address : currency.tokenAddresses[0]);
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

  const balance = switchBalance
    ? balances && balances[currency.chainId]
      ? balances[currency.chainId][1].balance
      : 0
    : balances && balances[currency.chainId]
    ? balances[currency.chainId][0].balance
    : 0;

  const symbol = switchBalance ? `${currency.symbols[0]}-${currency.symbols[1]}` : currency.symbols[0];
  return (
    <div className="flex w-fit flex-col sm:w-full sm:flex-row 2xl:sm:flex-col">
      <div className="primary-shadow relative flex h-fit w-[320px] flex-col gap-1 rounded-[6px] bg-[#B9B8B80D] p-[34px_12px_12px_12px] 2xl:w-full">
        <div className="absolute right-3 top-2" onClick={() => setOpenSettingModal(true)}>
          <Cog8ToothIcon className="h-5 w-5 cursor-pointer hover:animate-spin dark:text-primary" />
        </div>
        <SwapPanel showHistory={false} size="sm" toChainId={currency.chainId} />
      </div>
      <div className="ml-0 mt-0 w-[320px] flex-1 sm:ml-4 sm:w-fit 2xl:sm:ml-0 2xl:mt-2 2xl:flex-none">
        {/* <SlippageInfo currency={currency} /> */}
        {/* <div className="mt-2" /> */}
        <VolumeInfo currency={currency} />
        <div className="primary-shadow mt-2 flex w-[320px] items-center justify-between rounded-[6px] bg-[#B9B8B80D] p-3">
          <div className="flex cursor-pointer items-center" onClick={() => setSwitchBalance(!switchBalance)}>
            <div className={`mr-2 text-white ${switchBalance ? "-scale-y-100" : ""}`}>{ChevronDownSVG}</div>
            <TokenLogo
              src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
              classNames="primary-shadow h-8 w-8 rounded-full"
            />

            <div className="ml-2">
              <div className="text-sm leading-none text-white">
                {BigNumberFormat(balance)} {symbol} Balance
              </div>
              <div className="mt-0.5 text-xs leading-none text-[#FFFFFF80]">
                {BigNumberFormat(balance * (switchBalance ? lpPrice : price))} USD
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
              target="_blank"
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

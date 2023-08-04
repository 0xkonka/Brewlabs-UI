import {
  ChartSVG,
  FixedSVG,
  FlagSVG,
  LiquiditySVG,
  LockSVG,
  TelegramSVG,
  VolumeSVG,
  VoteSVG,
  WebSiteSVG,
  checkCircleSVG,
  upSVG,
} from "@components/dashboard/assets/svgs";
import TokenLogo from "@components/logo/TokenLogo";
import { StarIcon } from "@heroicons/react/24/solid";
import { DEX_LOGOS } from "config/constants/swap";
import { isAddress } from "utils";
import { BigNumberFormat } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { usePairVoteInfo } from "./hooks/usePairInfo";
import { useAccount } from "wagmi";
import { useContext } from "react";
import { ChartContext } from "contexts/ChartContext";
import { addTokenToMetamask } from "lib/bridge/helpers";
import { BridgeToken } from "config/constants/types";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useFlaskNftData } from "state/nfts/hooks";
import StyledButton from "views/directory/StyledButton";

export default function TokenInfo({ currency, marketInfos }) {
  const { info: pairInfo, voteOrAgainst } = usePairVoteInfo(currency.address, currency.chainId);
  const { address: account, connector } = useAccount();
  const { favourites, onFavourites }: any = useContext(ChartContext);

  const { chainId } = useActiveChainId();
  const flaskNft = useFlaskNftData(chainId);
  const activeNFT = flaskNft.userData?.balances?.length;

  function onAddToMetamask() {
    if (!marketInfos || !marketInfos.address) return;
    addTokenToMetamask(connector, {
      address: marketInfos.address,
      decimals: marketInfos.decimals,
      symbol: marketInfos.symbol,
    } as BridgeToken);
  }
  const socials = [
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

  const infos = [
    {
      icon: LiquiditySVG,
      value: `${BigNumberFormat(marketInfos.liquidity)} Pool liquidity`,
    },
    { icon: ChartSVG, value: `$${BigNumberFormat(marketInfos.marketCap, 0)} Marketcap` },
    { icon: FixedSVG, value: `${BigNumberFormat(marketInfos.holders ? marketInfos.holders : 0)} Holders` },
    { icon: VolumeSVG, value: `${BigNumberFormat(marketInfos.volume24h)} Volume (24h)` },
  ];

  return (
    <div className="mr-0 mt-5 flex flex-col items-start justify-between md:flex-row md:items-center 2xl:mr-[296px]">
      <div className="flex flex-col items-start md:items-center ls:flex-row">
        <div className="item-start flex flex-col md:flex-row md:items-center ">
          <div className="flex items-center">
            <div
              className="cursor-pointer"
              onClick={() =>
                onFavourites(
                  currency.address.toLowerCase(),
                  currency.chainId,
                  currency.tokenAddresses[0].toLowerCase(),
                  currency.symbols[1],
                  1
                )
              }
            >
              <StarIcon
                className={`h-5 w-5 ${
                  favourites.find(
                    (favourite) =>
                      favourite.address === currency.address.toLowerCase() && favourite.chainId === currency.chainId
                  )
                    ? "text-primary"
                    : "text-tailwind"
                }`}
              />
            </div>
            <img src={DEX_LOGOS["uniswap"]} alt={""} className="primary-shadow mx-3 h-7 w-7 rounded-full" />
            <div className="flex">
              <TokenLogo
                src={getTokenLogoURL(isAddress(currency.tokenAddresses[0]), currency.chainId)}
                classNames="primary-shadow z-10 -mr-4 h-7 w-7 rounded-full"
              />
              <TokenLogo
                src={getTokenLogoURL(isAddress(currency.tokenAddresses[1]), currency.chainId)}
                classNames="primary-shadow h-7 w-7 rounded-full"
              />
            </div>
            <div className="ml-4 text-lg text-white">
              {currency.symbols[0]}-{currency.symbols[1]}
            </div>
          </div>
          <div className="mt-2 flex items-center md:mt-0">
            <div className="ml-0 flex md:ml-4">
              {socials.map((social: any, i) => {
                if (social.href === "#") return;
                return (
                  <a
                    key={i}
                    className={`mr-1.5 cursor-pointer ${
                      social.href ? "!text-white hover:opacity-60" : social.isActive ? "!text-green" : "!text-tailwind"
                    } transition [&>svg]:!h-[18px] [&>svg]:!w-[18px]`}
                    target="_blank"
                    href={social.href}
                    onClick={() => social.action && onAddToMetamask()}
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>
            <div className="ml-5 flex items-center">
              <div className="flex items-center">
                <StyledButton
                  className="mr-2 !bg-transparent !text-[#2FD35DBF] disabled:!text-tailwind [&>svg]:!h-4 [&>svg]:!w-4"
                  onClick={() => voteOrAgainst(currency.address, account, currency.chainId, "voted")}
                  disabled={!activeNFT}
                >
                  {VoteSVG}
                </StyledButton>
                <div className="text-white">{pairInfo ? pairInfo.voted.length : 0}</div>
              </div>
              <div className="ml-3 flex items-center">
                <StyledButton
                  className="mr-2 mt-1 rotate-180 !bg-transparent !text-[#DC4545] disabled:!text-tailwind [&>svg]:!h-4 [&>svg]:!w-4"
                  onClick={() => voteOrAgainst(currency.address, account, currency.chainId, "devoted")}
                  disabled={!activeNFT}
                >
                  {VoteSVG}
                </StyledButton>
                <div className="text-white">{pairInfo ? pairInfo.devoted.length : 0}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap ls:mt-0">
          {infos.map((data, i) => {
            return (
              <div key={i} className="mb-2 ml-0 flex w-[calc(50%-8px)] items-center md:mb-0 md:ml-4 md:w-fit">
                <div className="text-tailwind ">{data.icon}</div>
                <div className="ml-1.5 text-sm text-white">{data.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center">
        <div className={`flex items-center ${marketInfos.priceChange >= 0 ? "text-green" : "text-danger"}`}>
          <div className="mr-1 text-sm">
            {marketInfos.priceChange >= 0 ? "+" : ""}
            {(marketInfos.priceChange ?? 0).toFixed(2)}% (24h)
          </div>
          <div className="scale-[80%]">{upSVG}</div>
        </div>
        <div className="ml-2 text-lg text-white">${(marketInfos.price ?? 0).toFixed(3)}</div>
      </div>
    </div>
  );
}

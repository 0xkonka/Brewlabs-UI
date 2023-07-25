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
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { DEX_LOGOS } from "config/constants/swap";
import getTokenLogoURL from "utils/getTokenLogoURL";

export default function TokenInfo({ currency }) {
  const socials = [
    { icon: LockSVG, isActive: false },
    { icon: checkCircleSVG, isActive: false },
    { icon: WebSiteSVG, href: "#" },
    { icon: FlagSVG, href: "#" },
    { icon: TelegramSVG, href: "#" },
    { icon: <img src={"/images/wallets/metamask.png"} alt={""} className="h-5 w-5 rounded-full" />, action: "" },
  ];

  const infos = [
    { icon: LiquiditySVG, value: `273.82k Pool liquidity` },
    { icon: ChartSVG, value: `$493,023 Marketcap` },
    { icon: FixedSVG, value: `392 Holders` },
    { icon: VolumeSVG, value: `59.29k Volume (24h)` },
  ];
  return (
    <div className="mt-5 flex items-center justify-between">
      <div className="flex items-center">
        <div className="cursor-pointer">
          <StarIcon className="h-5 w-5 text-tailwind" />
        </div>
        <img src={DEX_LOGOS["uniswap-v2"]} alt={""} className="primary-shadow mx-3 h-7 w-7 rounded-full" />
        <div className="flex">
          <img
            src={getTokenLogoURL(currency.token0.address, currency.chainId)}
            alt={""}
            className="primary-shadow z-10 -mr-4 h-7 w-7 rounded-full"
          />
          <img
            src={getTokenLogoURL(currency.token1.address, currency.chainId)}
            alt={""}
            className="primary-shadow h-7 w-7 rounded-full"
          />
        </div>
        <div className="ml-4 text-lg text-white">
          {currency.token0.symbol}-{currency.token1.symbol}
        </div>
        <div className="ml-4 flex">
          {socials.map((social, i) => {
            return (
              <div
                key={i}
                className={`mr-1.5 cursor-pointer ${
                  social.href ? "hover:text-white" : ""
                } text-tailwind [&>svg]:!h-5 [&>svg]:!w-5`}
              >
                {social.icon}
              </div>
            );
          })}
        </div>
        <div className="ml-5 flex items-center">
          <div className="flex items-center">
            <div className="mr-2 cursor-pointer text-[#2FD35DBF] [&>svg]:!h-5 [&>svg]:!w-5">{VoteSVG}</div>
            <div className="text-white">45</div>
          </div>
          <div className="ml-3 flex items-center">
            <div className="mr-2 rotate-180 cursor-pointer text-[#DC4545] [&>svg]:!h-5 [&>svg]:!w-5">{VoteSVG}</div>
            <div className="text-white">12</div>
          </div>
        </div>
        <div className="flex">
          {infos.map((data, i) => {
            return (
              <div key={i} className="ml-4 flex items-center">
                <div className="text-tailwind ">{data.icon}</div>
                <div className="ml-1.5 text-sm text-white">{data.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center text-[#2FD35DBF]">
          <div className="text-sm mr-1">+2.23% (24h)</div>
          <div className="scale-[80%]">{upSVG}</div>
        </div>
        <div className="ml-2 text-white text-lg">$1.002</div>
      </div>
    </div>
  );
}

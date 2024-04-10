import { useContext } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoIcon from "components/LogoIcon";
import ConnectWallet from "components/wallet/ConnectWallet";
import DynamicHeroIcon, { IconName } from "components/DynamicHeroIcon";
import { navigationData, navigationExtraData } from "config/constants/navigation";

import { usePools } from "state/pools/hooks";
import { useFarms } from "state/farms/hooks";
import { useIndexes } from "state/indexes/hooks";
import { useFarms as useZaps } from "state/zap/hooks";
import { CommunityContext } from "contexts/CommunityContext";

// UI
import { Badge } from "@components/ui/badge";

const Navigation = () => {
  const pathname = usePathname();
  const { address } = useAccount();

  // Get the related counts
  // NOTE: pretty sure this doesn't work - look into later
  const { newProposalCount }: any = useContext(CommunityContext);
  navigationData.find((item) => item.name === "Communities")!.count = newProposalCount;

  const { pools } = usePools();
  const { indexes } = useIndexes();
  const { data: farms } = useFarms();
  const { data: zaps } = useZaps(address);

  const indexCount = indexes
    .filter((data) => data.visible)
    .filter((data) => +data.userData?.stakedUsdAmount > 0).length;

  const allPools = [...pools.filter((p) => p.visible), ...farms.filter((p) => p.visible), ...zaps];
  const investCount = allPools.filter((data) => data.userData?.stakedBalance.gt(0)).length;

  navigationData.find((item) => item.name === "Invest")!.count = investCount;
  navigationData.find((item) => item.name === "Indexes")!.count = indexCount;

  return (
    <div className="group flex min-h-0 w-full flex-1 flex-col border-r border-gray-800 bg-zinc-950 shadow-lg shadow-zinc-950">
      <div className="flex w-16 flex-1 flex-col pb-4 pt-5 transition-width duration-500 ease-in-out group-hover:w-52">
        <div className="flex flex-shrink-0 items-center px-4">
          <LogoIcon classNames="w-8 text-brand" />
        </div>
        <nav className="mt-6 flex flex-1 flex-col justify-between" aria-label="Sidebar">
          <div className="flex flex-col">
            {navigationData.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-3 transition-colors duration-500 ease-out hover:bg-gray-700/60 active:bg-gray-800/60 ${
                  pathname === item.href && "active"
                }`}
              >
                <div className="relative">
                  {item.count > 0 && (
                    <div className="absolute -left-4 -top-2 h-2 w-2 rounded-full bg-amber-300 animate-in zoom-in fill-mode-forwards group-hover:animate-out group-hover:zoom-out" />
                  )}

                  {item.new && (
                    <div className="absolute -right-8 -top-2 rounded bg-zinc-800 px-1 py-px text-[9px] text-yellow-200 ring-1 ring-yellow-200 animate-in zoom-in fill-mode-forwards group-hover:animate-out group-hover:zoom-out">
                      New
                    </div>
                  )}

                  <DynamicHeroIcon
                    icon={item.icon as IconName}
                    className="w-5 text-gray-300 group-hover:text-gray-400 active:text-brand"
                  />
                </div>
                <div className="relative animate-out fade-out fill-mode-forwards group-hover:animate-in group-hover:fade-in">
                  {item.count > 0 && (
                    <Badge variant="secondary" className="absolute -right-12 top-0 text-xs">
                      {item.count}
                    </Badge>
                  )}

                  <span className="whitespace-nowrap text-sm text-gray-500 active:text-brand">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4 overflow-hidden">
            <div>
              {navigationExtraData.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-4 px-5 py-2 transition-colors duration-500 ease-out hover:bg-gray-800/60"
                >
                  <DynamicHeroIcon
                    icon={item.icon as IconName}
                    className="w-5 text-gray-500 group-hover:text-gray-400"
                  />
                  <span className="whitespace-nowrap text-sm text-gray-500 opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-1000">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>

            <ConnectWallet />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;

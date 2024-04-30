import { Fragment } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";

import { Badge } from "@components/ui/badge";

import LogoIcon from "components/LogoIcon";
import ConnectWallet from "components/wallet/ConnectWallet";
import DynamicHeroIcon, { IconName } from "components/DynamicHeroIcon";
import { navigationData, navigationExtraData } from "config/constants/navigation";

import { usePools } from "state/pools/hooks";
import { useFarms } from "state/farms/hooks";
import { useIndexes } from "state/indexes/hooks";
import { useFarms as useZaps } from "state/zap/hooks";

const Navigation = () => {
  const pathname = usePathname();
  const { address } = useAccount();

  const { pools } = usePools();
  const { indexes } = useIndexes();
  const { data: farms } = useFarms();
  const { data: zaps } = useZaps(address);

  const indexCount = indexes
    .filter((data) => data.visible)
    .filter((data) => +data.userData?.stakedUsdAmount > 0).length;

  const allPools = [...pools.filter((p) => p.visible), ...farms.filter((p) => p.visible), ...zaps];
  const investCount = allPools.filter((data) => data.userData?.stakedBalance.gt(0)).length;

  navigationData.find((item) => item.name === "Earn")!.count = investCount;
  navigationData.find((item) => item.name === "Indexes")!.count = indexCount;

  return (
    <div className="min-h-svh group flex min-h-0 w-full flex-1 flex-col overflow-y-auto border-r border-gray-800 bg-gray-950 shadow-lg shadow-zinc-950 lg:overflow-y-visible">
      <div className="flex w-full flex-1 flex-col pb-4 pt-5 transition-width duration-500 ease-in-out lg:w-16 lg:group-hover:w-52">
        <div className="flex flex-shrink-0 items-center px-4">
          <LogoIcon classNames="w-8 text-brand" />
        </div>
        <nav className="mt-6 flex flex-1 flex-col justify-between" aria-label="Sidebar">
          <div className="flex flex-col">
            {navigationData.map((item) => (
              <Fragment key={item.name}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-4 px-5 py-3 transition-colors duration-500 ease-out hover:bg-gray-700/60 active:bg-gray-800/60 ${
                    pathname === item.href && "active"
                  }`}
                >
                  <div className="relative">
                    {item.count > 0 && (
                      <div className="absolute -left-4 -top-2 hidden h-2 w-2 rounded-full bg-amber-300 animate-in zoom-in fill-mode-forwards group-hover:animate-out group-hover:zoom-out lg:block" />
                    )}

                    <DynamicHeroIcon
                      icon={item.icon as IconName}
                      className="w-5 text-gray-300 group-hover:text-gray-400 active:text-brand"
                    />
                  </div>
                  <div className="relative group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500 lg:opacity-0">
                    {item.count > 0 && (
                      <Badge variant="secondary" className="absolute -right-12 top-0 text-xs">
                        {item.count}
                      </Badge>
                    )}

                    <span className="whitespace-nowrap text-sm text-gray-500 active:text-brand">{item.name}</span>
                  </div>
                  {item.new && (
                    <div className="-right-4 top-2 rounded bg-zinc-800 px-1 py-px text-[9px] text-yellow-200 ring-1 ring-yellow-200 animate-in zoom-in fill-mode-forwards group-hover:animate-out group-hover:zoom-out lg:absolute">
                      New
                    </div>
                  )}
                </Link>

                {item.children && (
                  <ul className="relative transition-all fill-mode-forwards lg:max-h-0 lg:group-hover:max-h-[20rem]">
                    <div className="absolute left-7 top-0 h-full w-0.5 bg-gray-800/60" />

                    {item.children.map((child) => (
                      <li key={`sub-${child.name}`}>
                        <Link
                          href={child.href}
                          className={`relative flex items-center gap-4 py-2 pl-10 pr-5 text-xs transition-colors duration-500 ease-out hover:bg-gray-700/60 active:bg-gray-800/60 ${
                            pathname === child.href && "active"
                          }`}
                        >
                          <div className="relative">
                            {child.count > 0 && (
                              <div className="absolute -left-4 -top-2 hidden h-2 w-2 rounded-full bg-amber-300 animate-in zoom-in fill-mode-forwards group-hover:animate-out group-hover:zoom-out lg:block" />
                            )}
                          </div>
                          <div className="relative group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500 lg:opacity-0">
                            {child.count > 0 && (
                              <Badge variant="secondary" className="absolute -right-12 top-0 text-xs">
                                {child.count}
                              </Badge>
                            )}

                            <span className="whitespace-nowrap text-sm text-gray-500 active:text-brand">
                              {child.name}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex flex-col gap-4 lg:overflow-hidden">
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
                  <span className="whitespace-nowrap text-sm text-gray-500 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-1000 lg:opacity-0">
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

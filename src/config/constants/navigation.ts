import { IconName } from "../../components/DynamicHeroIcon";

type NavigationItem = {
  name: string;
  href: string;
  external: boolean;
  icon: IconName;
};

export const navigationData = [
  {
    name: "Home",
    href: "https://brewlabs.info/",
    external: true,
    icon: "HomeIcon",
  },
  {
    name: "Staking",
    href: "/staking",
    external: false,
    icon: "ClockIcon",
  },
  {
    name: "Farms",
    href: "/farms",
    external: false,
    icon: "ArrowTrendingUpIcon",
  },
  {
    name: "Stable Indexes",
    href: "/stables",
    external: false,
    icon: "Bars3CenterLeftIcon",
  },
  {
    name: "Bridge",
    href: "/bridge",
    external: false,
    icon: "ArrowsRightLeftIcon",
  },
  {
    name: "Zap",
    href: "https://earn.brewlabs.info/zap",
    // href: "/zapper",
    external: true,
    icon: "BoltIcon",
  },
  {
    name: "Swap",
    href: "/swap",
    external: false,
    icon: "ArrowPathRoundedSquareIcon",
  },
  {
    name: "Constructor",
    href: "https://earn.brewlabs.info/liquidity",
    external: true,
    icon: "ArrowDownOnSquareIcon",
  },
] as NavigationItem[];

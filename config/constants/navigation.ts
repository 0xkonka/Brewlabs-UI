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
    href: "/",
    external: false,
    icon: "HomeIcon",
  },
  {
    name: "Staking",
    href: "https://earn.brewlabs.info/pools",
    external: true,
    icon: "ClockIcon",
  },
  {
    name: "Farms",
    href: "https://earn.brewlabs.info/farms",
    external: true,
    icon: "ArrowTrendingUpIcon",
  },
  {
    name: "Stables",
    href: "/stables",
    external: true,
    icon: "BanknotesIcon",
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
    external: true,
    icon: "BoltIcon",
  },
  {
    name: "Swap",
    href: "https://earn.brewlabs.info/swap",
    external: true,
    icon: "ArrowPathRoundedSquareIcon",
  },
  {
    name: "Constructor",
    href: "https://earn.brewlabs.info/liquidity",
    external: true,
    icon: "ArrowDownOnSquareIcon",
  },
] as NavigationItem[];

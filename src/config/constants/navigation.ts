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
  // {
  //   name: "Stables",
  //   href: "/stables",
  //   external: true,
  //   icon: "BanknotesIcon",
  // },
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

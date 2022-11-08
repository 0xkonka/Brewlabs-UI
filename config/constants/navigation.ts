import { IconName } from "../../components/DynamicHeroIcon";

type NavigationItem = {
  name: string;
  href: string;
  icon: IconName;
};

export const navigationData = [
  {
    name: "Home",
    href: "/",
    icon: "HomeIcon",
  },
  {
    name: "Staking",
    href: "/staking",
    icon: "ClockIcon",
  },
  {
    name: "Farms",
    href: "/farms",
    icon: "ArrowTrendingUpIcon",
  },
  {
    name: "Stables",
    href: "/stables",
    icon: "BanknotesIcon",
  },
  {
    name: "Bridge",
    href: "/bridge",
    icon: "ArrowsRightLeftIcon",
  },
  {
    name: "Zap",
    href: "/zapper",
    icon: "BoltIcon",
  },
  {
    name: "Swap",
    href: "/swap",
    icon: "ArrowPathRoundedSquareIcon",
  },
  {
    name: "Constructor",
    href: "/constructor",
    icon: "ArrowDownOnSquareIcon",
  },
] as NavigationItem[];

import { IconName } from "@components/DynamicHeroIcon";

type NavigationItem = {
  name: string;
  href: string;
  external: boolean;
  icon: IconName;
  isBeta?: boolean;
  count?: number;
  new?: boolean;
};

export const navigationData = [
  {
    name: "Home",
    href: "/",
    external: false,
    icon: "HomeIcon",
  },
  {
    name: "Chart",
    href: "/chart/bsc/0xc9cc6515a1df94aaed156f3bd6efe86a100308fa",
    external: false,
    icon: "PresentationChartLineIcon",
  },
  {
    name: "Invest",
    href: "/staking",
    external: false,
    icon: "ClockIcon",
  },

  {
    name: "Indexes",
    href: "/indexes",
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
    name: "Swap",
    href: "/swap",
    external: false,
    icon: "ArrowPathRoundedSquareIcon",
  },
  {
    name: "Constructor",
    href: "/constructor",
    external: false,
    icon: "ArrowDownOnSquareIcon",
  },
  {
    name: "Product deployer",
    href: "/deployer",
    external: false,
    icon: "BeakerIcon",
    new: true,
  },
  {
    name: "Brewlabs NFT",
    href: "/nft",
    external: false,
    icon: "MapIcon",
  },
  {
    name: "Communities",
    href: "/communities",
    external: false,
    icon: "FlagIcon",
  },
] as NavigationItem[];

export const navigationExtraData = [
  {
    name: "Airdrop tools",
    href: "https://brewlabs-airdrop.tools/bsc",
    external: true,
    icon: "PaperAirplaneIcon",
  },
  {
    name: "Brewlabs Factory",
    href: "https://brewlabs.info/factory",
    external: true,
    icon: "BuildingOffice2Icon",
  },
  {
    name: "Brewlabs docs",
    href: "https://brewlabs.gitbook.io/welcome-to-brewlabs/important-docs/brewlabs-dapp-terms-of-service",
    external: true,
    icon: "DocumentTextIcon",
  },
] as NavigationItem[];

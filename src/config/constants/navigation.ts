import { IconName } from "@components/DynamicHeroIcon";

type NavigationItem = {
  name: string;
  href: string;
  external: boolean;
  icon: IconName;
  isBeta?: boolean;
  count?: number;
  new?: boolean;
  children?: NavigationItem[];
};

export const navigationData = [
  {
    name: "Home",
    href: "/",
    external: false,
    icon: "HomeIcon",
  },
  {
    name: "Earn",
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
    children: [
      {
        name: "Yield Farm",
        href: "/deployer/deploy-farm",
        external: false,
      },
      {
        name: "Index",
        href: "/deployer/deploy-index",
        external: false,
      },
      {
        name: "Token",
        href: "/deployer/deploy-token",
        external: false,
      },
      {
        name: "Staking Pool",
        href: "/deployer/deploy-pool",
        external: false,
      },
    ],
  },
  {
    name: "Brewlabs NFT",
    href: "/nft",
    external: false,
    icon: "MapIcon",
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

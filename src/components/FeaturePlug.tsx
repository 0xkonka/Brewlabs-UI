import { CheckIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const features = [
  {
    name: "Swap tokens",
    description: "Swap tokens in real time with ease across multiple networks at the best prices on the BrewSwap.",
    link: "/swap",
  },
  {
    name: "Track performance",
    description: "Manage your live portfolio with the Brewlabs dashboard personalised for your wallet.",
    link: "/performance",
  },
  {
    name: "Construct liquidity",
    description: "Manage your liquidity across various decentralised exchanges.",
    link: "",
    external: true,
  },
  {
    name: "Index",
    description: "Purchase a basket of tokens to speculate performance and mitigate investment risk.",
    link: "",
  },
  {
    name: "Cross-chain bridging",
    description: "Move your tokens cross-chain between networks with the Brewlabs bridge.",
    link: "",
  },
  { name: "Zap", description: "Find the best performing yield farms and participate with a single click.", link: "" },
  {
    name: "Yield farming",
    description: "Discover yield farming opportunities through Brewlabs and partners.",
    link: "",
  },
  {
    name: "NTFs",
    description: "Explore the TrueNFT marketplace for your favourite NFT’s, stake, mint and transfer NFTS plus more.",
    link: "",
  },
];

const FeaturePlug = () => {
  return (
    <div className="bg-zinc-900">
      <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:grid lg:grid-cols-3 lg:gap-x-12 lg:px-8 lg:py-40">
        <div>
          <h2 className="font-brand text-lg font-semibold leading-8 tracking-widest text-dark dark:text-brand">
            Everything you need
          </h2>
          <p className="mt-2 font-brand text-4xl font-bold tracking-widest text-gray-900">All-in-one platform</p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
            dolor cupiditate blanditiis ratione.
          </p>
        </div>
        <div className="mt-20 lg:col-span-2 lg:mt-0">
          <dl className="grid grid-cols-1 gap-12 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <Link className="" href={feature.link}>
                  <dt>
                    <CheckIcon className="absolute mt-1 h-6 w-6 text-dark dark:text-brand" aria-hidden="true" />
                    <p className="ml-10 text-lg font-semibold leading-8 text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-10 text-base leading-7 text-gray-600">{feature.description}</dd>
                </Link>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturePlug;

import { CheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Container from "@components/layout/Container";

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
    link: "/constructor",
  },
  {
    name: "Index",
    description: "Purchase a basket of tokens to speculate performance and mitigate investment risk.",
    link: "/indexes",
  },
  {
    name: "Cross-chain bridging",
    description: "Move your tokens cross-chain between networks with the Brewlabs bridge.",
    link: "/bridge",
  },
  { name: "Zap", description: "Find the best performing yield farms and participate with a single click.", link: "" },
  {
    name: "Yield farming",
    description: "Discover yield farming opportunities through Brewlabs and partners.",
    link: "/zapper",
  },
  {
    name: "NFTs",
    description: "Explore the TrueNFT marketplace for your favourite NFT’s, stake, mint and transfer NFTS plus more.",
    link: "https://truenft.io/home",
  },
];

const FeaturePlug = () => {
  return (
    <Container>
      <div className="py-24 sm:py-32 lg:grid lg:grid-cols-3 lg:gap-x-12 lg:py-40">
        <div>
          <h2 className="font-brand text-lg font-semibold leading-8 tracking-widest text-dark dark:text-brand">
            Everything you need
          </h2>
          <p className="mt-2 font-brand text-4xl font-bold tracking-widest text-gray-200">All-in-one platform</p>
          <p className="mt-6 text-base leading-7 text-gray-300">
            Brewlabs offers a range of decentralised on chain products for users and teams to utilise individually or as
            a team.
          </p>
          <p className="mt-6 text-base leading-7 text-gray-300">
            As a user you can find all the tools needed to support your decision making and revenue streams on chain
            within the Brewlabs platform.
          </p>
          <p className="mt-6 text-base leading-7 text-gray-300">
            Teams can also utilise Brewlabs platform as a source of web3 and deployable smart contract products.
          </p>
        </div>
        <div className="mt-20 lg:col-span-2 lg:mt-0">
          <dl className="grid grid-cols-1 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-4">
            {features.map((feature) => (
              <div key={feature.name} className="group relative w-full px-6 py-8">
                <div className="absolute inset-0 border border-gray-700 bg-gradient-to-tr from-zinc-800 to-zinc-900 bg-[-45rem] opacity-0 transition-all duration-500 ease-in-out group-hover:bg-center group-hover:opacity-40"></div>
                <Link className="relative" href={feature.link}>
                  <dt>
                    <CheckIcon
                      className="absolute mt-1 h-6 w-6 text-dark transition-all duration-300 group-hover:scale-110 dark:text-brand"
                      aria-hidden="true"
                    />
                    <p className="ml-10 text-lg font-semibold leading-8 text-gray-200">{feature.name}</p>
                  </dt>
                  <dd className="ml-10 mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </dd>
                </Link>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Container>
  );
};

export default FeaturePlug;

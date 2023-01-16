import { CheckIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "Swap tokens",
    description: "You can manage phone, email and chat conversations all from a single mailbox.",
  },
  {
    name: "Track performance",
    description: "You can manage phone, email and chat conversations all from a single mailbox.",
  },
  {
    name: "Construct liquidity",
    description: "You can manage phone, email and chat conversations all from a single mailbox.",
  },
  { name: "Invest", description: "You can manage phone, email and chat conversations all from a single mailbox." },
  {
    name: "Cross-chain bridging",
    description: "Find what you need with advanced filters, bulk actions, and quick views.",
  },
  { name: "Zap", description: "Find what you need with advanced filters, bulk actions, and quick views." },
  { name: "Stables", description: "Find what you need with advanced filters, bulk actions, and quick views." },
  { name: "Mobile app", description: "Find what you need with advanced filters, bulk actions, and quick views." },
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
                <dt>
                  <CheckIcon className="absolute mt-1 h-6 w-6 text-dark dark:text-brand" aria-hidden="true" />
                  <p className="ml-10 text-lg font-semibold leading-8 text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-10 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturePlug;

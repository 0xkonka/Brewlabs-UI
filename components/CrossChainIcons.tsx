import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { networks } from "../data/networks";

type CrossChainIconsProps = {
  chainOne: string;
  chainTwo: string;
};

const CrossChainIcons = ({ chainOne, chainTwo }: CrossChainIconsProps) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="-mr-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${
            networks.find((network) => network.name === chainOne)?.image
          }')`,
        }}
      />

      <ArrowRightCircleIcon className="z-10 h-6 w-6 overflow-hidden  rounded-full bg-white text-gray-900" />

      <div
        className="-ml-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${
            networks.find((network) => network.name === chainTwo)?.image
          }')`,
        }}
      />
    </div>
  );
};

export default CrossChainIcons;

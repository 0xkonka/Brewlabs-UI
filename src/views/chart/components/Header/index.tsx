import { ChartSquareSVG, NFTSVG, SwitchSVG } from "@components/dashboard/assets/svgs";
import { SearchInput } from "./SearchInput";
import { useGlobalState } from "state";
import UserDashboard from "@components/dashboard/UserDashboard";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { getChainLogo } from "utils/functions";
import { NATIVE_CURRENCIES } from "@brewlabs/sdk";
import { useDexPrice } from "@hooks/useTokenPrice";
import { getNativeWrappedAddress } from "utils/addressHelpers";

export default function Header({ showReverse, setShowReverse }) {
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");
  const { chainId } = useActiveChainId();
  const { price } = useDexPrice(chainId, getNativeWrappedAddress(chainId));

  return (
    <div className="relative z-[101] mt-10 flex">
      <div className="flex flex-1">
        <div className="relative flex-1">
          <SearchInput />
          <a
            href={"https://t.me/MaverickBL"}
            target={"_blank"}
            className="absolute -bottom-5 right-0 cursor-pointer font-brand text-xs !text-[#FFFFFF59] hover:!text-white"
          >
            Advertise with us
          </a>
        </div>
      </div>

      <div
        className={`ml-4 mt-4 hidden w-fit items-center justify-between text-tailwind xsm:mt-0 xsm:flex ${
          showReverse ? "2xl:w-[320px]" : "2xl:w-[292px]"
        }`}
      >
        <div className="primary-shadow flex h-[44px] items-center rounded-md bg-[#202023] p-2.5 font-roboto text-xs font-medium text-white mr-4">
          <img src={getChainLogo(chainId)} alt={""} className="h-4 w-4 rounded-full" />
          <div className="ml-1.5 leading-[1.2]">
            <div>{NATIVE_CURRENCIES[chainId].symbol}</div>
            <div>
              {(price ?? 0).toFixed(2)} <span className="text-[10px] text-[#FFFFFF80]">USD</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div
            className="mr-4 cursor-pointer  transition hover:text-white [&>svg]:!h-5 [&>svg]:!w-5"
            onClick={() => {
              setIsOpen(isOpen === 1 ? 1 : 2);
              setSidebarContent(<UserDashboard />);
            }}
          >
            {ChartSquareSVG}
          </div>
          <div
            className="mr-4 cursor-pointer transition hover:text-white  [&>svg]:!h-5 [&>svg]:!w-5"
            onClick={() => setShowReverse(!showReverse)}
          >
            {SwitchSVG}
          </div>
          <div
            className="tooltip cursor-pointer transition  hover:text-white [&>svg]:!h-5 [&>svg]:!w-5"
            data-tip="No Brewlabs NFT found."
          >
            {NFTSVG}
          </div>
        </div>
      </div>
    </div>
  );
}

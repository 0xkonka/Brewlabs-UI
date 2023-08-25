import { ChartSquareSVG, NFTSVG, SwitchSVG } from "@components/dashboard/assets/svgs";
import { SearchInput } from "./SearchInput";
import { useGlobalState } from "state";
import CurrencySelector from "@components/CurrencySelector";
import { DEX_GURU_CHAIN_NAME } from "config";
import { useRouter } from "next/router";

export default function Header({ showReverse, setShowReverse }) {
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");

  const router = useRouter();

  function onUserInput(input, currency) {}
  async function onCurrencySelect(input, currency) {
    router.push(`/chart/${DEX_GURU_CHAIN_NAME[currency.chainId]}/${currency.address}`);
  }

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

      <div className="flex items-center justify-between">
        <div
          className={`ml-4 mt-4 hidden w-fit items-center justify-end text-tailwind xsm:mt-0 xsm:flex ${
            showReverse ? "2xl:w-[320px]" : "2xl:w-[292px]"
          }`}
        >
          <div
            className="mr-4 cursor-pointer  transition hover:text-white [&>svg]:!h-5 [&>svg]:!w-5"
            onClick={() => {
              setIsOpen(isOpen === 1 ? 1 : 2);
              setSidebarContent(
                <CurrencySelector
                  inputType={"input"}
                  selectedCurrency={null}
                  onUserInput={onUserInput}
                  type={""}
                  onCurrencySelect={onCurrencySelect}
                />
              );
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

import { OpenWalletSVG } from "@components/dashboard/assets/svgs";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";
import FavouriteCard from "./FavouriteCard";
import CurrencySelector from "@components/CurrencySelector";
import { useGlobalState } from "state";

export default function FavouritePanel({ setSelectedCurrency }) {
  const { favourites, setCriteria }: any = useContext(ChartContext);
  const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
  const [, setSidebarContent] = useGlobalState("userSidebarContent");

  function onUserInput(input, currency) { }
  function onCurrencySelect(input, currency) {
    setCriteria(currency.address);
  }
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary">
          <div>
            <StarIcon className="h-4 w-4" />
          </div>
          <div className=" ml-1 text-sm">Favourites</div>
        </div>
        <div
          className="primary-shadow flex cursor-pointer items-center rounded-md bg-[#B9B8B80D]  p-[6px_10px] text-primary"
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
          <div className="mr-1 text-sm leading-none">Open wallet</div>
          <div>{OpenWalletSVG}</div>
        </div>
      </div>
      <div className="mt-3 yellowScroll overflow-x-clip max-h-[540px] overflow-y-scroll pr-2 pt-2">
        {favourites.map((favourite, i) => {
          return <FavouriteCard key={i} pair={favourite} setSelectedCurrency={setSelectedCurrency} />;
        })}
      </div>
    </div>
  );
}

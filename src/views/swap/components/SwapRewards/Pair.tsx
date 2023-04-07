import { ChevronDownSVG } from "components/dashboard/assets/svgs";
import "react-tooltip/dist/react-tooltip.css";
import StyledButton from "views/directory/StyledButton";
import { BrewlabsPair } from "config/constants/types";
import { useClaim } from "hooks/swap/useClaim";
import { useCurrency } from "hooks/Tokens";
import { CurrencyLogo } from "components/logo";

const Pair = ({pair}: {pair: BrewlabsPair}) => {
  const {token0, token1, volumeUSD} = pair;
  const currency0 = useCurrency(token0.id);
  const currency1 = useCurrency(token1.id);
  const { claim } = useClaim();

  return (

      <div className="mt-6 flex flex-wrap items-center justify-between rounded-[30px] border  border-[#FFFFFF80] p-[24px_12px_24px_12px] sm:p-[24px_15px_24px_24px]">
        <div className="h-[39px] w-[39px] rounded-full border border-black bg-[#D9D9D9]" />
        <div className="mx-2 flex items-center">
          <CurrencyLogo currency={currency0} size="39px" />
          <CurrencyLogo currency={currency1} size="39px" />
          <div className="ml-2">
            <div className="text-white">{token0.symbol}-{token1.symbol}</div>
            <div className="text-xs text-[#FFFFFF80]">Vol. ${volumeUSD.toString()} </div>
          </div>
        </div>
        <div className="relative mt-5 h-[36px] w-full xsm:mt-0 xsm:w-[110px]">
          <StyledButton type={"quinary"} onClick={claim(pair)}>
            <div className="text-xs leading-none">Harvest</div>
            <div className="absolute right-2 scale-125 text-[#EEBB19]">{ChevronDownSVG}</div>
          </StyledButton>
        </div>
      </div>
    
  );
};

export default Pair;

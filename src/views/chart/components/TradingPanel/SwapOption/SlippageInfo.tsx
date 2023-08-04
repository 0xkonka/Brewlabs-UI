import { SkeletonComponent } from "@components/SkeletonComponent";
import { RefreshSVG } from "@components/dashboard/assets/svgs";
import { useTokenTaxes } from "@hooks/useTokenInfo";

export default function SlippageInfo({ currency }) {
  const { buyTaxes, sellTaxes }: any = useTokenTaxes(
    currency.tokenAddresses[0],
    currency.chainId,
    currency.address,
    currency.swap
  );
  return (
    <div className="primary-shadow rounded-[6px] bg-[#B9B8B80D] p-[20px_12px] text-sm leading-none">
      <div className="mx-auto flex max-w-[280px] items-center justify-between">
        <div>
          <div className="text-white">Buy Slippage</div>
          <div className="mt-1 text-[#3AFDB7]">
            <SkeletonComponent />
          </div>
        </div>
        <div className="text-tailwind [&>svg]:!h-5 [&>svg]:!w-5">{RefreshSVG}</div>
        <div className="text-right">
          <div className="text-white">Sell slippage</div>
          <div className="mt-1 text-[#DC4545]">
            <SkeletonComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

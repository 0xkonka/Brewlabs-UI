import { getExplorerLogo } from "utils/functions";
import type { SupportedNft } from "config/constants/bond-tokens";
import CurrencySelectorNftMarketPrice from "components/currency-selector/currency-selector-nft-marketprice";

const CurrencySelectorSupportedNftItem = ({ nft }: { nft: SupportedNft }) => {
  return (
    <div className="relative">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://etherscan.io/address/${nft.address}`}
        className="absolute right-2 top-6 flex items-center gap-2 text-xs text-gray-300 underline"
      >
        Etherscan
        <img src={getExplorerLogo(nft.chainId)} alt="explorer" width={15} height={15} />
      </a>
      <button
        type="button"
        disabled={true}
        className="group flex w-full justify-between border-b border-gray-600 from-transparent via-gray-800 to-transparent text-start animate-in fade-in enabled:hover:bg-gradient-to-r"
      >
        <div className="flex w-full items-center justify-between p-5 pl-0">
          <div className="flex gap-6">
            <div className="relative">
              <div className="w-40 overflow-hidden rounded-md border border-gray-600">
                <img src={nft.image} className="bg-slate-500 object-cover" alt={nft.name} width={160} height={160} />

                <div className="px-2 py-2">
                  <p className="text-xs">{nft.name}</p>
                  <p className="text-xs">{nft.symbol}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col py-1">
              <h3 className="mb-1 text-lg font-semibold">{nft.name}</h3>

              <p className="text-xs">{nft.name}</p>

              <div className="mt-auto">
                <CurrencySelectorNftMarketPrice chain={nft.chainId} address={nft.address} />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CurrencySelectorSupportedNftItem;

import Modal from "components/Modal";

import { getNftImage } from "utils/getNftImage";

import { useMarketplaceStore, setNftModalOpen } from "state/marketplace.store";

const BondNft = () => {
  const [viewableNft] = useMarketplaceStore("viewableNft");
  const [nftModalOpen] = useMarketplaceStore("nftModalOpen");

  if (!viewableNft || Object.entries(viewableNft).length === 0) return null;

  return (
    <Modal
      open={nftModalOpen}
      onClose={() => {
        setNftModalOpen(false);
      }}
    >
      <div className="flex w-full gap-6 p-6">
        <div className=" w-1/2 shrink-0 overflow-hidden rounded-md border border-gray-600">
          <img
            src={getNftImage(viewableNft)}
            className="bg-slate-500 object-cover"
            alt={viewableNft.name}
            width={280}
            height={280}
          />

          <div className="px-2 py-2 text-start">
            <p className="text-xs">{viewableNft.name}</p>
            <p className="text-xs">
              {viewableNft.symbol} - {viewableNft.tokenId}
            </p>
          </div>
        </div>

        <div className=" overflow-y-auto text-start">
          <h3 className="mb-1 text-lg font-semibold">{viewableNft.name}</h3>

          {viewableNft.metadata && "name" in viewableNft.metadata && (
            <p className="text-sm">{viewableNft.metadata?.name as string}</p>
          )}

          {viewableNft.metadata && "description" in viewableNft.metadata && (
            <p className="mt-3 text-sm text-gray-300">{viewableNft.metadata.description as string}</p>
          )}

          {viewableNft.metadata && "attributes" in viewableNft.metadata && (
            <>
              <h3 className="my-3 text-xl">Properties</h3>
              {Array.isArray(viewableNft.metadata?.attributes) &&
                viewableNft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-xs font-semibold">{attr.trait_type}:</span>
                    <span className="text-xs">{attr.value}</span>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BondNft;

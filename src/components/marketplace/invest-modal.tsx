import Modal from "components/Modal";

import { Input } from "@components/ui/input";

import { useMarketplaceStore, setInvestModalOpen } from "state/marketplace.store";

const InvestModal = () => {
  const [investModalOpen] = useMarketplaceStore("investModalOpen");
  const [investmentBond] = useMarketplaceStore("investmentBond");
  return (
    <Modal
      open={investModalOpen}
      onClose={() => {
        setInvestModalOpen(false);
      }}
    >
      <div className="flex h-96 flex-col gap-8 p-6">
        <h1 className="text-3xl">Invest in {investmentBond?.name}</h1>

        <div className="grid grid-cols-3 gap-4 divide-x-2 divide-gray-600 text-left">
          <div className="px-4">
            <h2 className="text-gray-400">Market price</h2>
            <span>{investmentBond?.marketPrice}</span>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Listing price</h2>
            <span>{investmentBond?.marketPrice}</span>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Variance</h2>
            <span>{investmentBond?.marketPrice}</span>
          </div>
        </div>

        <form>
          <Input placeholder="Enter amount" />
        </form>
      </div>
    </Modal>
  );
};

export default InvestModal;

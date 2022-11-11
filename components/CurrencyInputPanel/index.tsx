import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Card from "../../views/Swap/components/Card";
import NumericalInput from "./NumericalInput";

interface CurrencyInputPanelProps {
  label?: string;
}

const CurrencyInputPanel = ({ label }: CurrencyInputPanelProps) => {
  return (
    <Card>
      <div className="ml-6">
        <div>{label}</div>
        <div className="mt-1 flex justify-between">
          <div>
            <NumericalInput value="0.00" />
            <div className="text-xs">0.00 USD</div>
          </div>
          <div className="flex justify-end" style={{ minWidth: "170px" }}>
            <div className="flex">
              <div>
                <div className="mr-1 text-2xl">ETH</div>
                <div className="flex items-center">
                  <div className="mr-2 text-xs">24.21 ETH</div>
                  <img src="/images/explorer/etherscan.png" alt="" className="h-2 w-2" />
                </div>
              </div>
              <ChevronDownIcon className="mt-1 h-5 w-5 dark:text-brand" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrencyInputPanel;

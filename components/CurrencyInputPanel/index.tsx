import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TOKENS } from "config/constants/tokens";
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
        <div className="flex justify-between mt-1">
          <div>
            <NumericalInput value="0.00" />
            <div className="text-xs opacity-40">0.00 USD</div>
          </div>
          <div className="flex justify-end" style={{ minWidth: "170px" }}>
            <div className="flex">
              <div>
                <select
                  id="currency"
                  name="currency"
                  className="w-full py-0 text-2xl bg-transparent border-transparent"
                >
                  <option className="text-gray-500">ETH</option>
                  <option className="text-gray-500">BREW</option>
                  <option className="text-gray-500">GROVE</option>
                </select>
                <div className="flex items-center ml-4">
                  <div className="mr-2 text-xs">24.21 ETH</div>
                  <img src="/images/explorer/etherscan.png" alt="" className="w-2 h-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrencyInputPanel;

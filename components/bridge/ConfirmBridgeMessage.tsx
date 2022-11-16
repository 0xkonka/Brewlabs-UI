import { ReactElement } from "react";
import { useBridgeContext } from "contexts/BridgeContext";
import { getNetworkLabel } from "lib/bridge/helpers";
import { useGlobalState } from "../../state";
import CrossChainIcons from "../CrossChainIcons";
import Button from "../Button";

const ConfirmBridgeMessage = (): ReactElement => {
  const { amountInput, fromToken, toToken } = useBridgeContext();

  const [amount] = useGlobalState("userBridgeAmount");
  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");
  const [, setLocked] = useGlobalState("userBridgeLocked");

  return (
    <div className="p-8">
      <CrossChainIcons chainOne={networkFrom} chainTwo={networkTo} />

      <div className="mt-3 text-center sm:mt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Please confirm swap</h3>
        <div className="mx-auto mt-2 max-w-sm">
          <p className="text-sm text-gray-500">
            You are about to send{" "}
            <span className="font-bolder text-brand">
              {amountInput} {fromToken?.symbol} from the {getNetworkLabel(networkFrom)}
            </span>{" "}
            network to the <span className="font-bolder text-brand">{getNetworkLabel(networkTo)}</span> network.
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <Button onClick={() => setLocked(false)}>Confirm</Button>
        <Button onClick={() => setLocked(false)}>Cancel</Button>
      </div>
    </div>
  );
};

export default ConfirmBridgeMessage;

import { ReactElement } from "react";
import { useGlobalState } from "../../state";
import CrossChainIcons from "../../components/CrossChainIcons";
import Button from "../Button";

const ConfirmBridgeMessage = (): ReactElement => {
  const [amount] = useGlobalState("userBridgeAmount");
  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");
  const [locked, setLocked] = useGlobalState("userBridgeLocked");

  return (
    <div className="p-8">
      <CrossChainIcons chainOne={networkFrom.name} chainTwo={networkTo.name} />

      <div className="mt-3 text-center sm:mt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Please confirm swap</h3>
        <div className="mx-auto mt-2 max-w-sm">
          <p className="text-sm text-gray-500">
            You are about to send{" "}
            <span className="font-bolder text-brand">
              {amount} BREWLABS from the {networkFrom.name}
            </span>{" "}
            network to the <span className="font-bolder text-brand">{networkTo.name}</span> network.
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-flow-row-dense grid-cols-2 gap-3 sm:mt-6">
        <Button onClick={() => setLocked(false)}>Confirm</Button>
        <Button onClick={() => setLocked(false)}>Cancel</Button>
      </div>
    </div>
  );
};

export default ConfirmBridgeMessage;

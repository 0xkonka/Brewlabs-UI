import { useSupportedNetworks } from "hooks/useSupportedNetworks";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { useNetwork } from "wagmi";
import Card from "./Card";

const ChainSelect = () => {
  const { chain } = useNetwork();
  const supportedNetworks = useSupportedNetworks();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Card>
      <select
        id="chain"
        name="chain"
        value={chain?.id}
        onChange={(e) => switchNetwork(+e.target.value)}
        className="w-full px-0 py-0 bg-transparent border-transparent"
      >
        {supportedNetworks.map((network) => (
          <option value={network.id} className="text-gray-500">
            {network.name}
          </option>
        ))}
      </select>
    </Card>
  );
};

export default ChainSelect;

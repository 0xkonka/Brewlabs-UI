import { useDisconnect } from "wagmi";
import { setUserSidebarOpen } from "state";

const DisconnectWalletButton = () => {
  const { disconnect } = useDisconnect();

  return (
    <button
      className="btn"
      onClick={() => {
        disconnect(), setUserSidebarOpen(false);
      }}
    >
      Disconnect wallet
    </button>
  );
};

export default DisconnectWalletButton;

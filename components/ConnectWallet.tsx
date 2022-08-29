import { useMoralis } from "react-moralis";
import { setGlobalState } from "../state";
import { BeakerIcon } from "@heroicons/react/outline";

const ConnectWallet = () => {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();

  const connect = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Connect to Brewlabs" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user!.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div className="flex-shrink-0 flex p-4 border-t border-gray-200 dark:border-gray-800">
      {!isAuthenticated ? (
        <button onClick={connect} className="flex-shrink-0 w-full group block">
          <div className="flex items-center animate-pulse">
            <div className="border-2 border-dark rounded-full p-2">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Connect wallet
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                Connect to interact
              </p>
            </div>
          </div>
        </button>
      ) : (
        <button
          onClick={() => setGlobalState("userSidebarOpen", true)}
          className="flex-shrink-0 w-full group block"
        >
          <div className="flex items-center">
            <div className="border-2 border-dark dark:border-brand rounded-full p-2">
              <BeakerIcon className="inline-block h-6 w-6 rounded-full" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate text-gray-700 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100">
                {user!.get("ethAddress")}
              </p>
              <p className="text-xs text-left font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100">
                Connected
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;

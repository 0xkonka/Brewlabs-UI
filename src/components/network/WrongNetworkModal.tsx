import { useEffect } from "react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import { BananaIcon } from "lucide-react";

import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { PAGE_SUPPORTED_CHAINS, CHAIN_LABELS, CHAIN_ICONS } from "config/constants/networks";

import Modal from "components/Modal";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

type WrongNetworkModalProps = {
  open: boolean;
};

const WrongNetworkModal = ({ open }: WrongNetworkModalProps) => {
  const { canSwitch, switchNetwork, error } = useSwitchNetwork();

  const { pathname } = useRouter();
  const page = pathname.split("/").slice(-1)[0];
  const pageSupportedChains = PAGE_SUPPORTED_CHAINS[page] || [];

  useEffect(() => {
    if (error) {
      toast.error(error?.message ?? "Error switching network. Please try again.");
    }
  }, [error]);

  return (
    <Modal open={open}>
      <div className="p-8">
        <BananaIcon className="mx-auto h-16 w-16 text-yellow-500" />

        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-xl font-medium leading-6 text-gray-200">You are on an unsupported network</h3>
          <div className="mx-auto my-3 max-w-sm">
            <p className="text-sm text-gray-500">Please switch networks to continue.</p>
          </div>
        </div>

        <div className="mt-5 text-center sm:mt-6 sm:grid">
          <div className="flex justify-center">
            {canSwitch ? (
              <Select onValueChange={(value) => switchNetwork(Number(value))}>
                <SelectTrigger className=" mx-auto w-52 text-center">
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {pageSupportedChains.map((chain) => (
                      <SelectItem key={chain} value={chain.toString()}>
                        <img src={CHAIN_ICONS[chain]} alt="network icon" className="mr-2 inline-block h-5 w-5" />
                        {CHAIN_LABELS[chain]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <div
                className="relative mt-2 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-red-600"
                role="alert"
              >
                <strong className="font-bold">Unable to switch network. Please try it on your wallet</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WrongNetworkModal;

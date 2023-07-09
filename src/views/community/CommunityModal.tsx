/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAccount } from "wagmi";
import StyledInput from "@components/StyledInput";
import { useState } from "react";
import DropDown from "@components/dashboard/TokenList/Dropdown";
import { getChainLogo } from "utils/functions";
import { NETWORKS } from "config/constants/networks";

const CommunityModal = ({ open, setOpen }) => {
  const { address: account } = useAccount();

  const [title, setTitle] = useState("");
  const [communityType, setCommunityType] = useState(4);
  const [contractAddress, setContractAddress] = useState("");
  const [selectedChainId, setSelectedChainId] = useState(0);

  const chains = [NETWORKS[1], NETWORKS[56], NETWORKS[137], NETWORKS[42161]];
  return (
    <Dialog
      open={open}
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand backdrop-blur-[2px] dark:bg-zinc-900 dark:bg-opacity-80"
      onClose={() => {}}
    >
      <div className="flex min-h-full items-center justify-center p-4 ">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.75,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              ease: "easeOut",
              duration: 0.15,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: "easeIn",
              duration: 0.15,
            },
          }}
          transition={{ duration: 0.25 }}
        >
          <div className="primary-shadow relative w-[calc(100vw-24px)] max-w-[720px] rounded bg-[#18181B] p-[38px_47px_40px_64px] text-white ">
            <div>
              <div>New Community</div>
              <div className="text-[#FFFFFF80]">
                <span className="text-white">By</span> {account} (Must be contract owner or deployer). All fields need
                completion below.
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div>Community title</div>
                <StyledInput value={title} setValue={setTitle} placeholder="Write your title here" />
              </div>
              <div>
                <div>Type</div>
                <DropDown
                  value={communityType}
                  setValue={setCommunityType}
                  values={["Team", "Group", "Influencer", "Guild", "Community", "Rabble", "Degens", "Traders"]}
                  type={"secondary"}
                  width="w-[120px]"
                  className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div>Contract address</div>
                <StyledInput value={contractAddress} setValue={setContractAddress} placeholder="0x...." />
              </div>
              <div>
                <div>Network</div>
                <div className="flex items-center">
                  <DropDown
                    value={selectedChainId}
                    setValue={setSelectedChainId}
                    values={chains.map((data) => data.nativeCurrency.symbol)}
                    type={"secondary"}
                    width="w-[72px]"
                    className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary"
                  />
                  <img
                    src={getChainLogo(parseInt(chains[selectedChainId].chainId))}
                    alt={""}
                    className="h-6 w-6 rounded-full"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setOpen(false);
              }}
              className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default CommunityModal;

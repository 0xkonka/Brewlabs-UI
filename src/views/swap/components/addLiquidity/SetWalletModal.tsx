/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

import { InfoSVG } from "components/dashboard/assets/svgs";
import StyledInput from "components/StyledInput";
import StyledButton from "views/directory/StyledButton";

const SetWalletModal = ({ open, setOpen, onClick }: { open: boolean; setOpen: any; onClick: any }) => {
  const [address, setAddress] = useState("");

  return (
    <Dialog
      open={open}
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
      onClose={() => setOpen(false)}
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
          <div className="relative w-[calc(100vw-24px)] max-w-[500px] rounded border-[2px] border-brand bg-[rgb(24,24,27)] p-[40px_33px_30px_37px] text-white">
            <div className="relative text-lg">
              Set wallet for team address
              <div className="absolute -left-5 top-1 text-white [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-100">
                {InfoSVG}
              </div>
            </div>
            <div className="mb-4 mt-2 text-sm">Nominate your target wallet for this swap fee category.</div>
            <StyledInput value={address} setValue={setAddress} placeholder="0x........." className="w-full" />
            <div className="mt-2.5 flex">
              <StyledButton
                className="!h-9 !w-28 !bg-[#B9B8B81A] text-xs !font-normal !text-[#FFFFFFBF]"
                onClick={() => setOpen(false)}
              >
                Back
              </StyledButton>
              <div className="mr-3" />
              <StyledButton
                className="!h-9 !w-28 text-xs !font-normal"
                onClick={() => {
                  onClick(address);
                  setOpen(false);
                }}
              >
                Confirm
              </StyledButton>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-3 -top-1 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
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

export default SetWalletModal;
